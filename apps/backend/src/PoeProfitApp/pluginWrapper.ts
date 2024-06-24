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
        this.isEnable = false;
    }

    async init(): Promise<boolean> {
        try {
            this.plugin.initialized = await this.plugin.init();
            this.isEnable = this.plugin._settings.enable;
            Logger.debug(`Plugin ${this.plugin.name} initialized.`);
            return true;
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(
                    `Plugin ${this.plugin.name} not initialized. \n \tError: ${error.message}`,
                );
            }
            return false;
        }
    }

    async update(): Promise<STATUS_CODE> {
        return await this.plugin.update();
    }

    onClose(): void {
        this.plugin.onClose();
    }

    loadSettings(): void {
        this.plugin._loadSettings();
    }

    async getData(): Promise<unknown> {
        return this.plugin.getAllData();
    }

    async close(): Promise<void> {
        try {
            this.plugin._saveSettings();
            await this.plugin.onClose();
            await this.plugin.dispose();
        } catch (error) {
            if (error instanceof Error) {
                Logger.error(error.message);
            }
        }
    }
}
