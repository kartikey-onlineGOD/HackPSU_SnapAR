import { ToggleButton } from 'SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton';

@component
export class MultipleChoiceToggle extends BaseScriptComponent {
    @input
    myToggles: SceneObject[] = [];

    @input
    squadPanel: SceneObject;

    private isUpdating: boolean = false;

    onAwake() {
        this.setupToggleButtons();
        if (this.squadPanel) {
            this.squadPanel.enabled = false; // Hide squad panel on start
        }
    }

    setupToggleButtons() {
        this.myToggles.forEach((element, index) => {
            let toggleButton = element.getComponent(ToggleButton.getTypeName());
            
            if (toggleButton) {
                // Set up the onStateChanged listener for each button
                toggleButton.onStateChanged.add((state: boolean) => {
                    if (!this.isUpdating) {
                        this.handleButtonToggle(index, state);
                    }
                });
            } else {
                print(`ToggleButton component not found on toggle ${index}`);
            }
        });
    }

    handleButtonToggle(toggledIndex: number, isOn: boolean) {
        this.isUpdating = true;

        this.myToggles.forEach((element, index) => {
            let toggleButton = element.getComponent(ToggleButton.getTypeName());
            if (toggleButton) {
                if (index === toggledIndex) {
                    toggleButton.isToggledOn = isOn;
                    // Check if this is the third button (index 2) and update squad panel visibility
                    if (index === 2) {
                        this.updateSquadPanelVisibility(isOn);
                    }
                } else if (isOn) {
                    // Turn off other buttons only if the current button is being turned on
                    toggleButton.isToggledOn = false;
                }
            }
        });

        this.logButtonStates();
        this.isUpdating = false;
    }

    logButtonStates() {
        let states = this.myToggles.map(element => {
            let toggleButton = element.getComponent(ToggleButton.getTypeName());
            return toggleButton && toggleButton.isToggledOn ? "1" : "0";
        });
        print(`Toggle states: ${states.join(', ')}`);
    }
    
    updateSquadPanelVisibility(isVisible: boolean) {
        if (this.squadPanel) {
            this.squadPanel.enabled = isVisible;
            print(`Squad panel is now ${isVisible ? 'visible' : 'hidden'}`);
        } else {
            print("Squad panel is not set!");
        }
    }
}