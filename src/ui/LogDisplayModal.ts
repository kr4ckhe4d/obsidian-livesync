import { App, Modal } from "../deps.ts";
import type { ReactiveInstance, } from "../lib/src/dataobject/reactive.ts";
import { logMessages } from "../lib/src/mock_and_interop/stores.ts";
import { escapeStringToHTML } from "../lib/src/string_and_binary/strbin.ts";
import ObsidianLiveSyncPlugin from "../main.ts";

export class LogDisplayModal extends Modal {
    plugin: ObsidianLiveSyncPlugin;
    logEl: HTMLDivElement;
    unsubscribe: () => void;
    constructor(app: App, plugin: ObsidianLiveSyncPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        this.titleEl.setText("Sync status");

        contentEl.empty();
        const div = contentEl.createDiv("");
        div.addClass("op-scrollable");
        div.addClass("op-pre");
        this.logEl = div;
        function updateLog(logs: ReactiveInstance<string[]>) {
            const e = logs.value;
            let msg = "";
            for (const v of e) {
                msg += escapeStringToHTML(v) + "<br>";
            }
            this.logEl.innerHTML = msg;
        }
        logMessages.onChanged(updateLog);
        this.unsubscribe = () => logMessages.offChanged(updateLog);
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        if (this.unsubscribe) this.unsubscribe();
    }
}
