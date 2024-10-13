@component
export class CamPos extends BaseScriptComponent {
    @input
    cameraReference: SceneObject;

    @input
    textObject: SceneObject;  // Reference to the 3D text object in the scene

    private counter: number = 0;
    private positionHistory: number[] = [];
    private patternDetector: ('top' | 'bottom')[] = [];
    private lastExtremeValue: number | null = null;
    private lastUpdateTime: number = 0;
    private updateInterval: number = 0.5; // 0.5 seconds

    private textComponent: Text3D;

    onAwake() {
        print("SquatCounter script initialized");
        this.createEvent("UpdateEvent").bind(() => this.updatePosition());

        // Initialize the text component
        this.textComponent = this.textObject.getComponent("Component.Text3D") as Text3D;
        if (!this.textComponent) {
            print("Error: Text component not found on the specified object");
        } else {
            this.updateScoreDisplay(); // Initialize the display
        }
    }

    updatePosition() {
        const currentTime = getTime();
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return; // Not enough time has passed, skip this update
        }

        this.lastUpdateTime = currentTime;

        let cameraYPos = this.cameraReference.getTransform().getWorldPosition().y;
        print(cameraYPos);

        this.positionHistory.push(cameraYPos);


        this.detectPattern(cameraYPos);
    }

    detectPattern(currentPosition: number) {
        if (this.lastExtremeValue === null) {
            this.lastExtremeValue = currentPosition;
            return;
        }

        const threshold = 10; // Minimum change to consider as a new extreme point

        if (currentPosition > this.lastExtremeValue + threshold) {
            // We've found a new top
            this.patternDetector.push('top');
            this.lastExtremeValue = currentPosition;
        } else if (currentPosition < this.lastExtremeValue - threshold) {
            // We've found a new bottom
            this.patternDetector.push('bottom');
            this.lastExtremeValue = currentPosition;
        }

        // Keep only the last 3 elements in the pattern detector
        if (this.patternDetector.length > 3) {
            this.patternDetector.shift();
        }

        // Check for top-bottom-top pattern
        if (this.patternDetector.join('-') === 'top-bottom-top') {
            this.counter++;
            print(`Squat Count: ${this.counter}`);
            this.updateScoreDisplay(); // Update the display when counter changes
            // Reset pattern detector
            this.patternDetector = [];
        }
    }

    updateScoreDisplay() {
        if (this.textComponent) {
            this.textComponent.text = `${this.counter}`;
        }
    }
}