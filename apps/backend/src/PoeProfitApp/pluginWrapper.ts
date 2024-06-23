import { Logger } from "./helpers/logger.js";
import type { STATUS_CODE } from "./helpers/utils.js";
import type { IPlugin } from "./interface/IPlugin.js";

export class PluginWrapper {
    public plugin: IPlugin;
    public name: string;
    public isEnable: boolean;
    constructor(plugin: IPlugin) {
        this.plugin = plugin;
        this.name = plugin.name;
        this.isEnable = plugin._settings.enable;
    }

    async init(): Promise<void> {
        try {
            if (!this.plugin._settings) {
                throw new Error(
                    `Cant load plugin ${this.plugin.name} because not have settings.`,
                );
            }
            if (this.plugin.initialized) {
                throw new Error(
                    `Plugin ${this.plugin.name} already initialized.`,
                );
            }
            // this.plugin._settings.subscribe((value) => {
            //     try {
            //         if (value && !this.plugin.initialized) {
            //             this.plugin.init();
            //         }
            //         if (value && !this.plugin.initialized) {
            //             this.plugin._settings.enable = false;
            //         }
            //     } catch (error) {
            //         if (error instanceof Error) {
            //             Logger.error(error.message);
            //         } else {
            //             Logger.error(`${this.plugin.name} unknown error.`);
            //         }
            //     }
            // });

            if (this.plugin._settings.enable) {
                if (this.plugin.initialized) {
                    throw new Error(
                        `Plugin ${this.plugin.name} already initialize.`,
                    );
                }
            }
            this.plugin.initialized = await this.plugin.init();
            this.isEnable = this.plugin._settings.enable;
            Logger.debug(`Plugin ${this.plugin.name} initialized.`);
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
            }
        }
    }

    async update(): Promise<STATUS_CODE> {
        return await this.plugin.update();
    }

    onLoad(): void {
        this.plugin.onLoad();
    }

    onClose(): void {
        this.plugin.onClose();
    }

    onUnload(): void {
        this.plugin.onUnload();
    }

    loadSettings(): void {
        this.plugin._loadSettings();
    }

    close(): void {
        try {
            this.plugin._saveSettings();
            this.plugin.onClose();
            this.plugin.onUnload();
            this.plugin.dispose();
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
            }
        }
    }
}
