import * as alt from "alt-client"
import * as game from "natives"
import * as NativeUI from "../include/NativeUI/NativeUi"
import AbstractSubMenu from "./AbstractSubMenu"
import VehicleMod from "../enums/VehicleMod"
import Enum from "../utils/Enum"
import network from "../modules/Network"
import Vehicle from "../utils/Vehicle"
import Game from "../utils/Game"
import AbstractMenu from "./AbstractMenu"
import VehicleColorMenu from "./VehicleColorMenu"
import VehicleWheelsMenu from "./VehicleWheelsMenu"

export default class VehicleCustomizationMenu extends AbstractSubMenu {
    vehicle: alt.Vehicle
    private modMenus: ModMenu[]
    private bennys: BennysMenu

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title)
        new VehicleColorMenu(this, "Vehicle Colors")
        new VehicleWheelsMenu(this, "Vehicle Wheels")
        this.bennys = new BennysMenu(this, "Benny's Original")
        this.modMenus = [
            new ModMenu(this, "Armor", VehicleMod.Armor),
            new ModMenu(this, "Brakes", VehicleMod.Brakes),
            new ModMenu(this, "Engine", VehicleMod.Engine),
            new ModMenu(this, "Exhaust", VehicleMod.Exhaust),
            new ModMenu(this, "Fender", VehicleMod.Fender),
            new ModMenu(this, "Frame", VehicleMod.Frame),
            new ModMenu(this, "Front Bumper", VehicleMod.FrontBumper),
            new ModMenu(this, "Grille", VehicleMod.Grille),
            new ModMenu(this, "Hood", VehicleMod.Hood),
            new ModMenu(this, "Horn", VehicleMod.Horn),
            new ModMenu(this, "Rear Bumper", VehicleMod.RearBumper),
            new ModMenu(this, "Right Fender", VehicleMod.RightFender),
            new ModMenu(this, "Roof", VehicleMod.Roof),
            new ModMenu(this, "Skirts", VehicleMod.Skirts),
            new ModMenu(this, "Spoiler", VehicleMod.Spoiler),
            new ModMenu(this, "Suspension", VehicleMod.Suspension),
            new ModMenu(this, "Transmission", VehicleMod.Transmission),
        ].concat(this.bennys.modMenus)
        this.menuObject.MenuOpen.on(() => {
            if (!alt.Player.local.vehicle) {
                this.vehicle = undefined
                Game.lockMenuItems(this.menuObject)
            }
            else if (this.vehicle != alt.Player.local.vehicle) {
                this.vehicle = alt.Player.local.vehicle
                Game.unlockMenuItems(this.menuObject)
                this.addModMenus()
            }
        })
    }

    private getMenuFromMod(mod: VehicleMod) {
        return this.modMenus.find(menu => menu.mod == mod)
    }

    private addModMenus() {
        Vehicle.installModKit(this.vehicle)
        Enum.getValues(VehicleMod).forEach(mod => {
            this.getMenuFromMod(+mod)?.init(this.vehicle)
        })
    }
}

class BennysMenu extends AbstractSubMenu {
    modMenus: ModMenu[]

    constructor(parentMenu: AbstractMenu, title: string) {
        super(parentMenu, title)
        this.modMenus = [
            new ModMenu(this, "Aerials", VehicleMod.Aerials),
            new ModMenu(this, "Air Filter", VehicleMod.AirFilter),
            new ModMenu(this, "Arch Cover", VehicleMod.ArchCover),
            new ModMenu(this, "Dashboard", VehicleMod.Dashboard),
            new ModMenu(this, "Details", VehicleMod.Details),
            new ModMenu(this, "Dials", VehicleMod.Dials),
            new ModMenu(this, "Door Speaker", VehicleMod.DoorSpeaker),
            new ModMenu(this, "Engine Block", VehicleMod.EngineBlock),
            new ModMenu(this, "Hydraulics", VehicleMod.Hydraulics),
            new ModMenu(this, "Livery", VehicleMod.Livery),
            new ModMenu(this, "Ornaments", VehicleMod.Ornaments),
            new ModMenu(this, "Plaques", VehicleMod.Plaques),
            new ModMenu(this, "Plate", VehicleMod.Plate),
            new ModMenu(this, "Seats", VehicleMod.Seats),
            new ModMenu(this, "Shift Lever", VehicleMod.ShiftLever),
            new ModMenu(this, "Speakers", VehicleMod.Speakers),
            new ModMenu(this, "Steering Wheel", VehicleMod.SteeringWheel),
            new ModMenu(this, "Struts", VehicleMod.Struts),
            new ModMenu(this, "Tank", VehicleMod.Tank),
            new ModMenu(this, "Trim", VehicleMod.Trim),
            new ModMenu(this, "Trunk", VehicleMod.Trunk),
            new ModMenu(this, "Vanity", VehicleMod.Vanity),
            new ModMenu(this, "Visor", VehicleMod.Visor),
        ]
    }
}

class ModMenu extends AbstractSubMenu {
    mod: VehicleMod
    private numMods: number

    constructor(parentMenu: AbstractMenu, title: string, mod: VehicleMod) {
        super(parentMenu, title)
        this.mod = mod
    }

    init(vehicle: alt.Vehicle) {
        this.menuObject.Clear()
        this.numMods = game.getNumVehicleMods(vehicle.scriptID, this.mod)
        if (this.numMods == 0)
            this.menuItem.Enabled = false
        else {
            this.addMods(vehicle)
            Game.selectItem(this.menuObject.MenuItems[game.getVehicleMod(vehicle.scriptID, this.mod) + 1])
        }
    }

    private addMods(vehicle: alt.Vehicle) {
        for (let _i = 0; _i <= this.numMods; _i++) {
            let item = new NativeUI.UIMenuItem(this.menuItem.Text + " #" + _i)
            this.addItem(item, async () => {
                await network.callback("setVehicleMod", [vehicle, this.mod, _i])
                Game.selectItem(item)
            })
        }
    }
}