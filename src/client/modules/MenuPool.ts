import * as alt from "alt-client"
import * as NativeUI from "../include/NativeUI/NativeUi"
import MainMenu from "../menus/MainMenu"
import Key from "../enums/Key"

class MenuPool {
    menus: NativeUI.Menu[] = []
    mainMenu: MainMenu

    init() {
        this.mainMenu = new MainMenu("Main Menu")
        alt.on("keyup", (key: number) => {
            if (key == Key.M) {
                if (!this.isAnyMenuOpen())
                    this.mainMenu.menuObject.Open()
            }
        })
    }

    isAnyMenuOpen() {
        let result = false
        this.menus.forEach(menu => { if (menu.Visible) result = true })
        return result
    }
}

const menuPool = new MenuPool()
export default menuPool