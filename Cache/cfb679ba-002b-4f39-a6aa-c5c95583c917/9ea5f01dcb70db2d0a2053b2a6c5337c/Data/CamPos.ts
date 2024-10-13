@component
export class CamPos extends BaseScriptComponent {

    @input
    cameraReference: SceneObject;



    private counter: number = 0;
    private positionHistory: number[] = [];
    private patternDetector: ('top' | 'bottom')[] = [];
    private lastExtremeValue: number | null = null;
    private lastUpdateTime: number = 0;
    private updateInterval: number = 0.5; // 0.2 seconds

    onAwake() {
        print("SquatCounter script initialized");
        //this.createEvent("UpdateEvent").bind(() => this.updatePosition());
    }



    updatePosition() {
        const currentTime = getTime();
        if (currentTime - this.lastUpdateTime < this.updateInterval) {
            return; // Not enough time has passed, skip this update
        }

        this.lastUpdateTime = currentTime;

        let cameraYPos = this.cameraReference.getTransform().getWorldPosition().y;
        print(cameraYPos)

        this.positionHistory.push(cameraYPos);

        // Keep array at a reasonable size
        if (this.positionHistory.length > 10) {
            this.positionHistory.shift();
        }

        this.detectPattern(cameraYPos);
    }

    detectPattern(currentPosition: number) {
        if (this.lastExtremeValue === null) {
            this.lastExtremeValue = currentPosition;
            return;
        }

        const threshold = 5; // Minimum change to consider as a new extreme point

        if (currentPosition > this.lastExtremeValue + threshold) {
            // We've found a new top
            this.patternDetector.push('top');
            this.lastExtremeValue = currentPosition;
            // print("Top detected");
        } else if (currentPosition < this.lastExtremeValue - threshold) {
            // We've found a new bottom
            this.patternDetector.push('bottom');
            this.lastExtremeValue = currentPosition;
            // print("Bottom detected");
        }

        // Keep only the last 3 elements in the pattern detector
        if (this.patternDetector.length > 3) {
            this.patternDetector.shift();
        }

        // Check for top-bottom-top pattern
        if (this.patternDetector.join('-') === 'top-bottom-top') {
            this.counter++;
            print(`Squat Count: ${this.counter}`);
            // Reset pattern detector
            this.patternDetector = [];
        }
    }
}