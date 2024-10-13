import { ToggleButton } from 'SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton';

@component
export class MultipleChoiceToggle extends BaseScriptComponent {
    @input
    myToggles: SceneObject[] = [];

    @input
    squadPanel: SceneObject;

    @input
    bicepPanel: SceneObject;

    @input 
    LatRaise: SceneObject;

    @input
    shoulderPressPanel: SceneObject; 

    @input 
    SquatShow: SceneObject;

    private isUpdating: boolean = false;

    onAwake() {
        this.setupToggleButtons();
        if (this.squadPanel) {
            this.squadPanel.enabled = false;
            this.SquatShow.enabled = false // Hide squad panel on start
        }
        if (this.bicepPanel) {
            this.bicepPanel.enabled = false; // Hide bicep panel on start
        }
        if (this.LatRaise) {
            this.LatRaise.enabled = false; // Hide lat raise panel on start
        }
        if (this.shoulderPressPanel) {
            this.shoulderPressPanel.enabled = false; // Hide shoulder press panel on start
        }
    }

    setupToggleButtons() {
        this.myToggles.forEach((element, index) => {
            let toggleButton = element.getComponent(ToggleButton.getTypeName());
            
            if (toggleButton) {
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
                    if (index === 0) {
                        this.updateBicepPanelVisibility(isOn);
                    } else if (index === 1) {
                        this.updateShoulderPressPanelVisibility(isOn); // New condition for shoulder press
                    } else if (index === 2) {
                        this.updateSquadPanelVisibility(isOn);
                    } else if (index === 3) {
                        this.updateLatRaiseVisibility(isOn);
                    }
                } else if (isOn) {
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
            this.SquatShow.enabled = isVisible;
            print(`Squad panel is now ${isVisible ? 'visible' : 'hidden'}`);
        } else {
            print("Squad panel is not set!");
        }
    }

    updateBicepPanelVisibility(isVisible: boolean) {
        if (this.bicepPanel) {
            this.bicepPanel.enabled = isVisible;
            print(`Bicep panel is now ${isVisible ? 'visible' : 'hidden'}`);
        } else {
            print("Bicep panel is not set!");
        }
    }

    updateLatRaiseVisibility(isVisible: boolean) {
        if (this.LatRaise) {
            this.LatRaise.enabled = isVisible;
            print(`Lateral Raise panel is now ${isVisible ? 'visible' : 'hidden'}`);
        } else {
            print("Lateral Raise panel is not set!");
        }
    }

    updateShoulderPressPanelVisibility(isVisible: boolean) {
        if (this.shoulderPressPanel) {
            this.shoulderPressPanel.enabled = isVisible;
            print(`Shoulder Press panel is now ${isVisible ? 'visible' : 'hidden'}`);
        } else {
            print("Shoulder Press panel is not set!");
        }
    }
}