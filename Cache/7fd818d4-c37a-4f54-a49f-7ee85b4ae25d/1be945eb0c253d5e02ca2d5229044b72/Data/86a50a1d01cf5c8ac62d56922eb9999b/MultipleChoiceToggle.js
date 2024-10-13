"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleChoiceToggle = void 0;
var __selfType = requireType("./MultipleChoiceToggle");
function component(target) { target.getTypeName = function () { return __selfType; }; }
const ToggleButton_1 = require("SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton");
let MultipleChoiceToggle = class MultipleChoiceToggle extends BaseScriptComponent {
    onAwake() {
        this.setupToggleButtons();
        if (this.squadPanel) {
            this.squadPanel.enabled = false; // Hide squad panel on start
        }
    }
    setupToggleButtons() {
        this.myToggles.forEach((element, index) => {
            let toggleButton = element.getComponent(ToggleButton_1.ToggleButton.getTypeName());
            if (toggleButton) {
                // Set up the onStateChanged listener for each button
                toggleButton.onStateChanged.add((state) => {
                    if (!this.isUpdating) {
                        this.handleButtonToggle(index, state);
                    }
                });
            }
            else {
                print(`ToggleButton component not found on toggle ${index}`);
            }
        });
    }
    handleButtonToggle(toggledIndex, isOn) {
        this.isUpdating = true;
        if (isOn) {
            this.myToggles.forEach((element, index) => {
                let toggleButton = element.getComponent(ToggleButton_1.ToggleButton.getTypeName());
                if (toggleButton) {
                    if (index === toggledIndex) {
                        toggleButton.isToggledOn = true;
                        // Check if this is the third button (index 2) and call showSquadCounter
                        if (index === 2) {
                            this.showSquadCounter();
                        }
                    }
                    else {
                        toggleButton.isToggledOn = false;
                        // Hide the squad counter if any other button is toggled
                        if (index === 2 && this.squadPanel) {
                            this.squadPanel.enabled = false;
                        }
                    }
                }
            });
        }
        this.logButtonStates();
        this.isUpdating = false;
    }
    logButtonStates() {
        let states = this.myToggles.map(element => {
            let toggleButton = element.getComponent(ToggleButton_1.ToggleButton.getTypeName());
            return toggleButton && toggleButton.isToggledOn ? "1" : "0";
        });
        print(`Toggle states: ${states.join(', ')}`);
    }
    showSquadCounter() {
        if (this.squadPanel) {
            this.squadPanel.enabled = !this.squadPanel.enabled;
            print(`Squad panel is now ${this.squadPanel.enabled ? 'visible' : 'hidden'}`);
        }
        else {
            print("Squad panel is not set!");
        }
    }
    __initialize() {
        super.__initialize();
        this.isUpdating = false;
    }
};
exports.MultipleChoiceToggle = MultipleChoiceToggle;
exports.MultipleChoiceToggle = MultipleChoiceToggle = __decorate([
    component
], MultipleChoiceToggle);
//# sourceMappingURL=MultipleChoiceToggle.js.map