import { ToggleButton } from 'SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton';

@component
export class CamPos extends BaseScriptComponent {
    @input
    cameraReference: SceneObject;

    @input
    textObject: SceneObject;

    @input
    timerObject: SceneObject;

    @input
    scoreObject: SceneObject;

    @input
    squadPanel: SceneObject; // Reference to the squad panel

    private repCounter: number = 0;
    private setCounter: number = 0;
    private score: number = 0;
    private lastPosition: number | null = null;
    private lastUpdateTime: number = 0;
    private updateInterval: number = 0.1;
    private isMovingUp: boolean = false;

    private textComponent: Text3D;
    private timerComponent: Text3D;
    private scoreComponent: Text3D;

    private isTimerRunning: boolean = false;
    private timerStartTime: number = 0;
    private timerDuration: number = 15;

    private isWorkoutComplete: boolean = false;
    private isCountingEnabled: boolean = false; // Start with counting disabled

    onAwake() {
        print("SquatCounter script initialized");
        this.createEvent("UpdateEvent").bind(() => this.update());

        this.textComponent = this.textObject.getComponent("Component.Text3D") as Text3D;
        this.timerComponent = this.timerObject.getComponent("Component.Text3D") as Text3D;
        this.scoreComponent = this.scoreObject.getComponent("Component.Text3D") as Text3D;

        if (!this.textComponent || !this.timerComponent || !this.scoreComponent) {
            print("Error: Required component not found on the specified object(s)");
        } else {
            this.updateDisplay();
        }

        this.setupSquadPanelVisibilityListener();
    }

    setupSquadPanelVisibilityListener() {
        if (this.squadPanel) {
            // Create an UpdateEvent to check panel visibility each frame
            this.createEvent("UpdateEvent").bind(() => {
                const isVisible = this.squadPanel.enabled;
                if (this.isCountingEnabled !== isVisible) {
                    this.isCountingEnabled = isVisible;
                    print(`Squat counting ${this.isCountingEnabled ? 'enabled' : 'disabled'}`);
                }
            });
        } else {
            print("Squad panel is not set!");
        }
    }

    update() {
        if (!this.isWorkoutComplete && this.isCountingEnabled) {
            this.updatePosition();
        }
        if (this.isTimerRunning) {
            this.updateTimer();
        }
    }

    updatePosition() {
        const currentTime = getTime();
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return;
        }

        this.lastUpdateTime = currentTime;

        let cameraYPos = this.cameraReference.getTransform().getWorldPosition().y;
        print(cameraYPos);

        this.detectSquat(cameraYPos);
    }

    detectSquat(currentPosition: number) {
        if (this.lastPosition === null) {
            this.lastPosition = currentPosition;
            return;
        }

        const threshold = 10;

        if (currentPosition > this.lastPosition + threshold) {
            // Moving up
            if (!this.isMovingUp && !this.isTimerRunning) {
                this.isMovingUp = true;
                this.repCounter++;
                print(`Squat Count: ${this.repCounter}`);
                this.updateDisplay();

                if (this.repCounter === 8) {
                    this.completeSet();
                }
            }
        } else if (currentPosition < this.lastPosition - threshold) {
            // Moving down
            this.isMovingUp = false;
        }

        this.lastPosition = currentPosition;
    }

    completeSet() {
        this.setCounter++;
        this.score += 10;
        print(`Set completed! Total sets: ${this.setCounter}, Score: ${this.score}`);
        
        if (this.setCounter === 3) {
            this.completeWorkout();
        } else {
            this.startTimer();
            this.repCounter = 0;
        }
        
        this.updateDisplay();
    }

    completeWorkout() {
        this.isWorkoutComplete = true;
        print(`Workout completed! Final Score: ${this.score}`);
        this.updateDisplay();
        this.textComponent.text = "Workout complete!";
        this.timerComponent.text = "";
    }

    startTimer() {
        this.isTimerRunning = true;
        this.timerStartTime = getTime();
    }

    updateTimer() {
        const currentTime = getTime();
        const elapsedTime = currentTime - this.timerStartTime;
        const remainingTime = Math.max(0, this.timerDuration - elapsedTime);

        if (remainingTime > 0) {
            this.timerComponent.text = remainingTime.toFixed(1);
        } else {
            this.isTimerRunning = false;
            this.timerComponent.text = "GO!";
        }
    }

    updateDisplay() {
        if (this.textComponent) {
            if (this.isWorkoutComplete) {
                this.textComponent.text = "Workout complete!";
            } else {
                this.textComponent.text = `Reps: ${this.repCounter}/8\nSets: ${this.setCounter}/3`;
            }
        }
        if (this.scoreComponent) {
            this.scoreComponent.text = `Score: ${this.score}`;
        }
        if (this.isWorkoutComplete) {
            this.timerComponent.text = "";
        }
    }
}