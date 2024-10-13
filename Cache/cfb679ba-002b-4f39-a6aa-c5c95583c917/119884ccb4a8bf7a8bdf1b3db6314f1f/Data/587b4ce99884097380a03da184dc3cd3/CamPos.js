"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamPos = void 0;
var __selfType = requireType("./CamPos");
function component(target) { target.getTypeName = function () { return __selfType; }; }
let CamPos = class CamPos extends BaseScriptComponent {
    onAwake() {
        print("SquatCounter script initialized");
        this.createEvent("UpdateEvent").bind(() => this.updatePosition());
        // Initialize the text component
        this.textComponent = this.textObject.getComponent("Component.Text3D");
        if (!this.textComponent) {
            print("Error: Text component not found on the specified object");
        }
        else {
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
    detectPattern(currentPosition) {
        if (this.lastExtremeValue === null) {
            this.lastExtremeValue = currentPosition;
            return;
        }
        const threshold = 10; // Minimum change to consider as a new extreme point
        if (currentPosition > this.lastExtremeValue + threshold) {
            // We've found a new top
            this.patternDetector.push('top');
            this.lastExtremeValue = currentPosition;
        }
        else if (currentPosition < this.lastExtremeValue - threshold) {
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
    __initialize() {
        super.__initialize();
        this.counter = 0;
        this.positionHistory = [];
        this.patternDetector = [];
        this.lastExtremeValue = null;
        this.lastUpdateTime = 0;
        this.updateInterval = 0.5;
    }
};
exports.CamPos = CamPos;
exports.CamPos = CamPos = __decorate([
    component
], CamPos);
//# sourceMappingURL=CamPos.js.map