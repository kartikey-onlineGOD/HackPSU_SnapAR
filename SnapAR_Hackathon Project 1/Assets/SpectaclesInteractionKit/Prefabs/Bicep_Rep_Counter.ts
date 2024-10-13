import { SIK } from "SpectaclesInteractionKit/SIK";

@component
export class BicepRepCounter extends BaseScriptComponent {
    @input
    textObject: SceneObject;

    @input
    private textComponent: Text3D;
    
    @input
    private timerComponent: Text3D;

    @input
    private scoreComponent: Text3D;

    private repCounter: number = 0;
    private setCounter: number = 0;
    private score: number = 0;
    private lastPosition: number | null = null;
    private lastUpdateTime: number = 0;
    private updateInterval: number = 0.1;
    private isMovingUp: boolean = false;



    private isTimerRunning: boolean = false;
    private timerStartTime: number = 0;
    private timerDuration: number = 15;

    private isWorkoutComplete: boolean = false;
    private isSetStarted: boolean = false;

    private handInputData = SIK.HandInputData;
    private rightHand: any;
    private leftHand: any;

    onAwake() {
        print("BicepRepCounter script initialized");
        this.createEvent("UpdateEvent").bind(() => this.update());
        this.textComponent.text = "Start bicep curls!";
        // this.textComponent = this.textObject.getComponent("Component.Text3D") as Text3D;

        if (!this.textComponent || !this.timerComponent || !this.scoreComponent) {
            print("Error: Required component not found on the specified object(s)");
        } else {
            this.updateDisplay();
        }

        this.showInitialInstruction();

        this.rightHand = this.handInputData.getHand("right");
        this.leftHand = this.handInputData.getHand("left");
    }

    showInitialInstruction() {
        if (this.textComponent) {
            this.textComponent.text = "Start bicep curls!";
        }
        this.isSetStarted = false;
    }

    update() {
        if (!this.isWorkoutComplete) {
            this.updatePosition();
            if (!this.isSetStarted && this.repCounter === 0) {
                this.showInitialInstruction();
            }
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

        const rightHandPos = this.rightHand.indexTip.position;
        const leftHandPos = this.leftHand.indexTip.position;

        this.detectBicepCurl(Math.max(rightHandPos.y, leftHandPos.y));
    }

    detectBicepCurl(currentPosition: number) {
        if (this.lastPosition === null) {
            this.lastPosition = currentPosition;
            return;
        }

        const threshold = 10;

        if (currentPosition > this.lastPosition + threshold) {[]
            // Moving up
            if (!this.isMovingUp && !this.isTimerRunning) {
                this.isMovingUp = true;
                this.repCounter++;
                this.isSetStarted = true;
                print(`Bicep Curl Count: ${this.repCounter}`);
                this.updateDisplay();

                if (this.repCounter === 10) {
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
    }

    startTimer() {
        this.isTimerRunning = true;
        this.timerStartTime = getTime();
        if (this.textComponent) {
            this.textComponent.text = "Cooldown";
        }
    }

    updateTimer() {
        const currentTime = getTime();
        const elapsedTime = currentTime - this.timerStartTime;
        const remainingTime = Math.max(0, this.timerDuration - elapsedTime);

        if (remainingTime > 0) {
            this.timerComponent.text = `Rest: ${remainingTime.toFixed(1)}`;
        } else {
            this.isTimerRunning = false;
            this.timerComponent.text = "GO!";
            this.showInitialInstruction();
        }
    }

    updateDisplay() {
        if (this.textComponent) {
            if (this.isWorkoutComplete) {
                this.textComponent.text = "Workout complete!";
            } else if (this.isTimerRunning) {
                // Don't update text during cooldown, it's handled in updateTimer
            } else if (!this.isSetStarted) {
                this.textComponent.text = "Curl Now!";
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