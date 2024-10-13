import { ToggleButton } from 'SpectaclesInteractionKit/Components/UI/ToggleButton/ToggleButton';

@component
export class MultipleChoiceToggle extends BaseScriptComponent {
    @input
    myToggles: SceneObject[] = [];

    @input
    squadPanel: SceneObject;

    @input
    biPanel: SceneObject;

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
        this.hideAllPanels();
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

        // First, turn off all toggles and hide all panels
        this.hideAllPanels();
        this.myToggles.forEach((element) => {
            let toggleButton = element.getComponent(ToggleButton.getTypeName());
            if (toggleButton) {
                toggleButton.isToggledOn = false;
            }
        });

        // Then, turn on the selected toggle and show its panel
        if (isOn) {
            let selectedToggle = this.myToggles[toggledIndex].getComponent(ToggleButton.getTypeName());
            if (selectedToggle) {
                selectedToggle.isToggledOn = true;
                this.showSelectedPanel(toggledIndex);
            }
        }

        this.logButtonStates();
        this.isUpdating = false;
    }

    hideAllPanels() {
        if (this.squadPanel) {
            this.squadPanel.enabled = false;
            this.SquatShow.enabled = false;
        }
        if (this.bicepPanel) {
            this.bicepPanel.enabled = false;
            this.biPanel.enabled = false;
        }
        if (this.LatRaise) {
            this.LatRaise.enabled = false;
        }
        if (this.shoulderPressPanel) {
            this.shoulderPressPanel.enabled = false;
        }
    }

    showSelectedPanel(index: number) {
        switch(index) {
            case 0:
                this.updateBicepPanelVisibility(true);
                break;
            case 1:
                this.updateShoulderPressPanelVisibility(true);
                break;
            case 2:
                this.updateSquadPanelVisibility(true);
                break;
            case 3:
                this.updateLatRaiseVisibility(true);
                break;
        }
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
            this.biPanel.enabled = isVisible;
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