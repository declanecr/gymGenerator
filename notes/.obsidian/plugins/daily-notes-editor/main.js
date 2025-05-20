"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const require$$0 = require("obsidian");
const view = require("@codemirror/view");
const state = require("@codemirror/state");
function around(obj, factories) {
  const removers = Object.keys(factories).map((key) => around1(obj, key, factories[key]));
  return removers.length === 1 ? removers[0] : function() {
    removers.forEach((r) => r());
  };
}
function around1(obj, method, createWrapper) {
  const original = obj[method], hadOwn = obj.hasOwnProperty(method);
  let current = createWrapper(original);
  if (original)
    Object.setPrototypeOf(current, original);
  Object.setPrototypeOf(wrapper, current);
  obj[method] = wrapper;
  return remove;
  function wrapper(...args) {
    if (current === original && obj[method] === wrapper)
      remove();
    return current.apply(this, args);
  }
  function remove() {
    if (obj[method] === wrapper) {
      if (hadOwn)
        obj[method] = original;
      else
        delete obj[method];
    }
    if (current === original)
      return;
    current = original;
    Object.setPrototypeOf(wrapper, original || Function);
  }
}
function genId(size2) {
  const chars = [];
  for (let n = 0; n < size2; n++)
    chars.push((16 * Math.random() | 0).toString(16));
  return chars.join("");
}
const popovers = /* @__PURE__ */ new WeakMap();
function isDailyNoteLeaf(leaf) {
  return leaf.containerEl.matches(".dn-editor.dn-leaf-view .workspace-leaf");
}
function nosuper(base) {
  const derived = function() {
    return Object.setPrototypeOf(new require$$0.Component(), new.target.prototype);
  };
  derived.prototype = base.prototype;
  return Object.setPrototypeOf(derived, base);
}
const spawnLeafView = (plugin, initiatingEl, leaf, onShowCallback) => {
  let parent = plugin.app.workspace.activeLeaf;
  if (!parent)
    parent = leaf;
  if (!initiatingEl)
    initiatingEl = parent == null ? void 0 : parent.containerEl;
  const hoverPopover = new DailyNoteEditor(parent, initiatingEl, plugin, void 0, onShowCallback);
  return [hoverPopover.attachLeaf(), hoverPopover];
};
class DailyNoteEditor extends nosuper(require$$0.HoverPopover) {
  constructor(parent, targetEl, plugin, waitTime, onShowCallback) {
    var _a, _b;
    super();
    this.targetEl = targetEl;
    this.plugin = plugin;
    this.onShowCallback = onShowCallback;
    this.abortController = this.addChild(new require$$0.Component());
    this.detaching = false;
    this.opening = false;
    this.rootSplit = new require$$0.WorkspaceSplit(window.app.workspace, "vertical");
    this.isPinned = true;
    this.oldPopover = (_a = this.parent) == null ? void 0 : _a.DailyNoteEditor;
    this.id = genId(8);
    if (waitTime === void 0) {
      waitTime = 300;
    }
    this.onTarget = true;
    this.parent = parent;
    this.waitTime = waitTime;
    this.state = require$$0.PopoverState.Showing;
    this.document = ((_b = this.targetEl) == null ? void 0 : _b.ownerDocument) ?? window.activeDocument ?? window.document;
    this.hoverEl = this.document.defaultView.createDiv({
      cls: "dn-editor dn-leaf-view",
      attr: { id: "dn-" + this.id }
    });
    const { hoverEl } = this;
    this.abortController.load();
    this.timer = window.setTimeout(this.show.bind(this), waitTime);
    this.setActive = this._setActive.bind(this);
    if (hoverEl) {
      hoverEl.addEventListener("mousedown", this.setActive);
    }
    popovers.set(this.hoverEl, this);
    this.hoverEl.addClass("dn-editor");
    this.containerEl = this.hoverEl.createDiv("dn-content");
    this.buildWindowControls();
    this.setInitialDimensions();
  }
  static activeWindows() {
    const windows = [window];
    const { floatingSplit } = app.workspace;
    if (floatingSplit) {
      for (const split of floatingSplit.children) {
        if (split.win)
          windows.push(split.win);
      }
    }
    return windows;
  }
  static containerForDocument(plugin, doc) {
    if (doc !== document && plugin.app.workspace.floatingSplit)
      for (const container of plugin.app.workspace.floatingSplit.children) {
        if (container.doc === doc)
          return container;
      }
    return plugin.app.workspace.rootSplit;
  }
  static activePopovers() {
    return this.activeWindows().flatMap(this.popoversForWindow);
  }
  static popoversForWindow(win) {
    var _a;
    return Array.prototype.slice.call(((_a = win == null ? void 0 : win.document) == null ? void 0 : _a.body.querySelectorAll(".dn-leaf-view")) ?? []).map((el) => popovers.get(el)).filter((he) => he);
  }
  static forLeaf(leaf) {
    const el = leaf && document.body.matchParent.call(leaf.containerEl, ".dn-leaf-view");
    return el ? popovers.get(el) : void 0;
  }
  static iteratePopoverLeaves(ws, cb) {
    for (const popover of this.activePopovers()) {
      if (popover.rootSplit && ws.iterateLeaves(cb, popover.rootSplit))
        return true;
    }
    return false;
  }
  _setActive(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.plugin.app.workspace.setActiveLeaf(this.leaves()[0], { focus: true });
  }
  getDefaultMode() {
    return "source";
  }
  updateLeaves() {
    if (this.onTarget && this.targetEl && !this.document.contains(this.targetEl)) {
      this.onTarget = false;
      this.transition();
    }
    let leafCount = 0;
    this.plugin.app.workspace.iterateLeaves((leaf) => {
      leafCount++;
    }, this.rootSplit);
    if (leafCount === 0) {
      this.hide();
    }
    this.hoverEl.setAttribute("data-leaf-count", leafCount.toString());
  }
  leaves() {
    const leaves = [];
    this.plugin.app.workspace.iterateLeaves((leaf) => {
      leaves.push(leaf);
    }, this.rootSplit);
    return leaves;
  }
  setInitialDimensions() {
    this.hoverEl.style.height = "auto";
    this.hoverEl.style.width = "100%";
  }
  transition() {
    if (this.shouldShow()) {
      if (this.state === require$$0.PopoverState.Hiding) {
        this.state = require$$0.PopoverState.Shown;
        window.clearTimeout(this.timer);
      }
    } else {
      if (this.state === require$$0.PopoverState.Showing) {
        this.hide();
      } else {
        if (this.state === require$$0.PopoverState.Shown) {
          this.state = require$$0.PopoverState.Hiding;
          this.timer = window.setTimeout(() => {
            if (this.shouldShow()) {
              this.transition();
            } else {
              this.hide();
            }
          }, this.waitTime);
        }
      }
    }
  }
  buildWindowControls() {
    this.titleEl = this.document.defaultView.createDiv("popover-titlebar");
    this.titleEl.createDiv("popover-title");
    this.containerEl.prepend(this.titleEl);
  }
  attachLeaf() {
    this.rootSplit.getRoot = () => this.plugin.app.workspace[this.document === document ? "rootSplit" : "floatingSplit"];
    this.rootSplit.getContainer = () => DailyNoteEditor.containerForDocument(this.plugin, this.document);
    this.titleEl.insertAdjacentElement("afterend", this.rootSplit.containerEl);
    const leaf = this.plugin.app.workspace.createLeafInParent(this.rootSplit, 0);
    this.updateLeaves();
    return leaf;
  }
  onload() {
    super.onload();
    this.registerEvent(this.plugin.app.workspace.on("layout-change", this.updateLeaves, this));
    this.registerEvent(this.plugin.app.workspace.on("layout-change", () => {
      this.rootSplit.children.forEach((item, index) => {
        if (item instanceof require$$0.WorkspaceTabs) {
          this.rootSplit.replaceChild(index, item.children[0]);
        }
      });
    }));
  }
  onShow() {
    var _a, _b;
    const closeDelay = 600;
    setTimeout(() => this.waitTime = closeDelay, closeDelay);
    (_a = this.oldPopover) == null ? void 0 : _a.hide();
    this.oldPopover = null;
    this.hoverEl.toggleClass("is-new", true);
    this.document.body.addEventListener(
      "click",
      () => {
        this.hoverEl.toggleClass("is-new", false);
      },
      { once: true, capture: true }
    );
    if (this.parent) {
      this.parent.DailyNoteEditor = this;
    }
    const viewHeaderEl = this.hoverEl.querySelector(".view-header");
    viewHeaderEl == null ? void 0 : viewHeaderEl.remove();
    const sizer = this.hoverEl.querySelector(".workspace-leaf");
    if (sizer)
      this.hoverEl.appendChild(sizer);
    const inlineTitle = this.hoverEl.querySelector(".inline-title");
    if (inlineTitle)
      inlineTitle.remove();
    (_b = this.onShowCallback) == null ? void 0 : _b.call(this);
    this.onShowCallback = void 0;
  }
  detect(el) {
    const { targetEl } = this;
    if (targetEl) {
      this.onTarget = el === targetEl || targetEl.contains(el);
    }
  }
  shouldShow() {
    return this.shouldShowSelf() || this.shouldShowChild();
  }
  shouldShowChild() {
    return DailyNoteEditor.activePopovers().some((popover) => {
      if (popover !== this && popover.targetEl && this.hoverEl.contains(popover.targetEl)) {
        return popover.shouldShow();
      }
      return false;
    });
  }
  shouldShowSelf() {
    return !this.detaching && !!(this.onTarget || this.state == require$$0.PopoverState.Shown || this.document.querySelector(`body>.modal-container, body > #he${this.id} ~ .menu, body > #he${this.id} ~ .suggestion-container`));
  }
  show() {
    if (!this.targetEl || this.document.body.contains(this.targetEl)) {
      this.state = require$$0.PopoverState.Shown;
      this.timer = 0;
      this.targetEl.appendChild(this.hoverEl);
      this.onShow();
      this.plugin.app.workspace.onLayoutChange();
      this.load();
    } else {
      this.hide();
    }
    if (this.hoverEl.dataset.imgHeight && this.hoverEl.dataset.imgWidth) {
      this.hoverEl.style.height = parseFloat(this.hoverEl.dataset.imgHeight) + this.titleEl.offsetHeight + "px";
      this.hoverEl.style.width = parseFloat(this.hoverEl.dataset.imgWidth) + "px";
    }
  }
  onHide() {
    var _a;
    this.oldPopover = null;
    if (((_a = this.parent) == null ? void 0 : _a.DailyNoteEditor) === this) {
      this.parent.DailyNoteEditor = null;
    }
  }
  hide() {
    var _a;
    this.onTarget = false;
    this.detaching = true;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = 0;
    }
    this.hoverEl.hide();
    if (this.opening)
      return;
    const leaves = this.leaves();
    if (leaves.length) {
      leaves[0].detach();
    } else {
      this.parent = null;
      (_a = this.abortController) == null ? void 0 : _a.unload();
      this.abortController = void 0;
      return this.nativeHide();
    }
  }
  nativeHide() {
    var _a;
    const { hoverEl, targetEl } = this;
    this.state = require$$0.PopoverState.Hidden;
    hoverEl.detach();
    if (targetEl) {
      const parent = targetEl.matchParent(".dn-leaf-view");
      if (parent)
        (_a = popovers.get(parent)) == null ? void 0 : _a.transition();
    }
    this.onHide();
    this.unload();
  }
  resolveLink(linkText, sourcePath) {
    const link = require$$0.parseLinktext(linkText);
    const tFile = link ? this.plugin.app.metadataCache.getFirstLinkpathDest(link.path, sourcePath) : null;
    return tFile;
  }
  async openLink(linkText, sourcePath, eState, createInLeaf) {
    var _a, _b, _c;
    let file = this.resolveLink(linkText, sourcePath);
    const link = require$$0.parseLinktext(linkText);
    if (!file && createInLeaf) {
      const folder = this.plugin.app.fileManager.getNewFileParent(sourcePath);
      file = await this.plugin.app.fileManager.createNewMarkdownFile(folder, link.path);
    }
    if (!file) {
      return;
    }
    const { viewRegistry } = this.plugin.app;
    const viewType = viewRegistry.typeByExtension[file.extension];
    if (!viewType || !viewRegistry.viewByType[viewType]) {
      return;
    }
    eState = Object.assign(this.buildEphemeralState(file, link), eState);
    const parentMode = this.getDefaultMode();
    const state2 = this.buildState(parentMode, eState);
    const leaf = await this.openFile(file, state2, createInLeaf);
    const leafViewType = (_a = leaf == null ? void 0 : leaf.view) == null ? void 0 : _a.getViewType();
    if (leafViewType === "image") {
      if (((_b = this.parent) == null ? void 0 : _b.hasOwnProperty("editorEl")) && this.parent.editorEl.hasClass("is-live-preview")) {
        this.waitTime = 3e3;
      }
      const img = leaf.view.contentEl.querySelector("img");
      this.hoverEl.dataset.imgHeight = String(img.naturalHeight);
      this.hoverEl.dataset.imgWidth = String(img.naturalWidth);
      this.hoverEl.dataset.imgRatio = String(img.naturalWidth / img.naturalHeight);
    } else if (leafViewType === "pdf") {
      this.hoverEl.style.height = "800px";
      this.hoverEl.style.width = "600px";
    }
    if (((_c = state2.state) == null ? void 0 : _c.mode) === "source") {
      this.whenShown(() => {
        var _a2, _b2, _c2, _d;
        if (require$$0.requireApiVersion("1.0"))
          (_c2 = (_b2 = (_a2 = leaf == null ? void 0 : leaf.view) == null ? void 0 : _a2.editMode) == null ? void 0 : _b2.reinit) == null ? void 0 : _c2.call(_b2);
        (_d = leaf == null ? void 0 : leaf.view) == null ? void 0 : _d.setEphemeralState(state2.eState);
      });
    }
  }
  whenShown(callback) {
    if (this.detaching)
      return;
    const existingCallback = this.onShowCallback;
    this.onShowCallback = () => {
      if (this.detaching)
        return;
      callback();
      if (typeof existingCallback === "function")
        existingCallback();
    };
    if (this.state === require$$0.PopoverState.Shown) {
      this.onShowCallback();
      this.onShowCallback = void 0;
    }
  }
  async openFile(file, openState, useLeaf) {
    if (this.detaching)
      return;
    const leaf = useLeaf ?? this.attachLeaf();
    this.opening = true;
    try {
      await leaf.openFile(file, openState);
    } catch (e) {
      console.error(e);
    } finally {
      this.opening = false;
      if (this.detaching)
        this.hide();
    }
    this.plugin.app.workspace.setActiveLeaf(leaf);
    return leaf;
  }
  buildState(parentMode, eState) {
    return {
      active: false,
      // Don't let Obsidian force focus if we have autofocus off
      state: { mode: "source" },
      // Don't set any state for the view, because this leaf is stayed on another view.
      eState
    };
  }
  buildEphemeralState(file, link) {
    const cache = this.plugin.app.metadataCache.getFileCache(file);
    const subpath = cache ? require$$0.resolveSubpath(cache, (link == null ? void 0 : link.subpath) || "") : void 0;
    const eState = { subpath: link == null ? void 0 : link.subpath };
    if (subpath) {
      eState.line = subpath.start.line;
      eState.startLoc = subpath.start;
      eState.endLoc = subpath.end || void 0;
    }
    return eState;
  }
}
const addIconList = () => {
  require$$0.addIcon("daily-note", `<svg width="103" height="134" viewBox="0 0 103 134" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M60.3446 21.848H22.5577C19.5764 21.848 17.1595 24.2648 17.1595 27.2462V65.0331C17.1595 68.0144 19.5764 70.4312 22.5577 70.4312H60.3446C63.3259 70.4312 65.7428 68.0144 65.7428 65.0331V27.2462C65.7428 24.2648 63.3259 21.848 60.3446 21.848Z" stroke="#5C1111" stroke-width="4.81618" stroke-linecap="round" stroke-linejoin="round"/><path d="M52.2476 16.4498V27.2461" stroke="#5C1111" stroke-width="4.81618" stroke-linecap="round" stroke-linejoin="round"/><path d="M30.655 16.4498V27.2461" stroke="#5C1111" stroke-width="4.81618" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.1595 38.0424H65.7428" stroke="#5C1111" stroke-width="4.81618" stroke-linecap="round" stroke-linejoin="round"/><path d="M33.3541 54.2366L38.7523 59.6348L49.5485 48.8385" stroke="#5C1111" stroke-width="4.81618" stroke-linecap="round" stroke-linejoin="round"/><g filter="url(#filter0_ddddd_104_2)"><path d="M12.181 103.617L9.21851 95.8213L27.9292 87.0896L66.754 71.4973L93.1049 88.8047L91.3898 103.617H12.181Z" fill="#AC4DD9" stroke="black" stroke-width="0.963236"/><path d="M12.181 103.617L9.21851 95.9771L27.9292 87.0895L32.6069 103.461L12.181 103.617Z" fill="#540D75" stroke="black" stroke-width="0.963236"/><path d="M9.0625 95.6652L25.7894 67.212L27.9291 87.0894L9.21842 95.977L9.0625 95.6652Z" fill="#470068" stroke="black" stroke-width="0.481618"/><path d="M27.9291 87.0896L25.9021 66.8197L67.5335 56.2169L66.5979 71.4973L27.9291 87.0896Z" fill="#732E94" stroke="black" stroke-width="0.963236"/><path d="M66.598 71.4971L67.9466 56.3527L93.1049 88.8045L66.598 71.4971Z" fill="#C279E4" stroke="black" stroke-width="0.481618"/><path d="M9.0625 95.6652L25.7462 66.8195L67.9465 56.0808L93.1049 88.8046L66.598 71.4972L27.9291 87.0895L9.21842 95.9771L9.0625 95.6652Z" stroke="black" stroke-width="0.963236"/><path d="M26.0579 103.617L27.9289 87.0895L32.7625 103.617H26.0579Z" fill="#61018E" stroke="black" stroke-width="0.963236"/></g><defs><filter id="filter0_ddddd_104_2" x="0.0874329" y="53.8502" width="101.958" height="79.8707" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_104_2"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1.20405"/><feGaussianBlur stdDeviation="1.44485"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="effect1_dropShadow_104_2" result="effect2_dropShadow_104_2"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="5.2978"/><feGaussianBlur stdDeviation="2.6489"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"/><feBlend mode="normal" in2="effect2_dropShadow_104_2" result="effect3_dropShadow_104_2"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="11.7996"/><feGaussianBlur stdDeviation="3.61213"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/><feBlend mode="normal" in2="effect3_dropShadow_104_2" result="effect4_dropShadow_104_2"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="21.1912"/><feGaussianBlur stdDeviation="4.21416"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/><feBlend mode="normal" in2="effect4_dropShadow_104_2" result="effect5_dropShadow_104_2"/><feBlend mode="normal" in="SourceGraphic" in2="effect5_dropShadow_104_2" result="shape"/></filter></defs></svg>`);
};
const DEFAULT_SETTINGS = {
  hideFrontmatter: false,
  hideBacklinks: false,
  createAndOpenOnStartup: false,
  useArrowUpOrDownToNavigate: false,
  preset: []
};
class DailyNoteSettingTab extends require$$0.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.debounceApplySettingsUpdate = require$$0.debounce(
      async () => {
        await this.plugin.saveSettings();
      },
      200,
      true
    );
    this.debounceDisplay = require$$0.debounce(
      async () => {
        await this.display();
      },
      400,
      true
    );
    this.plugin = plugin;
  }
  applySettingsUpdate() {
    this.debounceApplySettingsUpdate();
  }
  async display() {
    await this.plugin.loadSettings();
    const { containerEl } = this;
    const settings = this.plugin.settings;
    containerEl.toggleClass("daily-note-settings-container", true);
    containerEl.empty();
    new require$$0.Setting(containerEl).setName("Hide frontmatter").setDesc("Hide frontmatter in daily notes").addToggle(
      (toggle) => toggle.setValue(settings.hideFrontmatter).onChange(async (value) => {
        this.plugin.settings.hideFrontmatter = value;
        document.body.classList.toggle(
          "daily-notes-hide-frontmatter",
          value
        );
        this.applySettingsUpdate();
      })
    );
    new require$$0.Setting(containerEl).setName("Hide backlinks").setDesc("Hide backlinks in daily notes").addToggle(
      (toggle) => toggle.setValue(settings.hideBacklinks).onChange(async (value) => {
        this.plugin.settings.hideBacklinks = value;
        document.body.classList.toggle(
          "daily-notes-hide-backlinks",
          value
        );
        this.applySettingsUpdate();
      })
    );
    new require$$0.Setting(containerEl).setName("Create and open Daily Notes Editor on startup").setDesc(
      "Automatically create today's daily note and open the Daily Notes Editor when Obsidian starts"
    ).addToggle(
      (toggle) => toggle.setValue(settings.createAndOpenOnStartup).onChange(async (value) => {
        this.plugin.settings.createAndOpenOnStartup = value;
        this.applySettingsUpdate();
      })
    );
    new require$$0.Setting(containerEl).setName("Use arrow up/down key to navigate between notes").addToggle(
      (toggle) => toggle.setValue(settings.useArrowUpOrDownToNavigate).onChange(async (value) => {
        this.plugin.settings.useArrowUpOrDownToNavigate = value;
        this.applySettingsUpdate();
      })
    );
    new require$$0.Setting(containerEl).setName("Saved presets").setHeading();
    const presetContainer = containerEl.createDiv("preset-container");
    if (settings.preset.length === 0) {
      presetContainer.createEl("p", {
        text: "No presets saved yet. Select a folder or tag in the Daily Notes Editor to create a preset.",
        cls: "no-presets-message"
      });
    } else {
      settings.preset.forEach((preset, index) => {
        new require$$0.Setting(containerEl).setName(
          preset.type === "folder" ? "Focus on Folder: " : "Focus on Tag: "
        ).setDesc(preset.target).addButton((button) => {
          button.setIcon("trash");
          button.onClick(() => {
            settings.preset.splice(index, 1);
            this.applySettingsUpdate();
            this.debounceDisplay();
          });
        });
      });
    }
    new require$$0.Setting(containerEl).setName("Add new preset").setDesc("Add a new folder or tag preset").addButton((button) => {
      button.setButtonText("Add Preset").setCta().onClick(() => {
        const modal = new AddPresetModal(
          this.app,
          (type, target) => {
            const existingPresetIndex = settings.preset.findIndex(
              (p) => p.type === type && p.target === target
            );
            if (existingPresetIndex === -1) {
              settings.preset.push({
                type,
                target
              });
              this.applySettingsUpdate();
              this.debounceDisplay();
            }
          }
        );
        modal.open();
      });
    });
  }
}
class AddPresetModal extends require$$0.Modal {
  constructor(app2, saveCallback) {
    super(app2);
    this.type = "folder";
    this.saveCallback = saveCallback;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Add New Preset" });
    const form = contentEl.createEl("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.save();
    });
    const typeSetting = form.createDiv();
    typeSetting.addClass("setting-item");
    const typeSettingInfo = typeSetting.createDiv();
    typeSettingInfo.addClass("setting-item-info");
    typeSettingInfo.createEl("div", {
      text: "Preset Type",
      cls: "setting-item-name"
    });
    const typeSettingControl = typeSetting.createDiv();
    typeSettingControl.addClass("setting-item-control");
    const folderRadio = typeSettingControl.createEl("input", {
      type: "radio",
      attr: {
        name: "preset-type",
        id: "preset-type-folder",
        value: "folder",
        checked: true
      }
    });
    typeSettingControl.createEl("label", {
      text: "Folder",
      attr: {
        for: "preset-type-folder"
      }
    });
    const tagRadio = typeSettingControl.createEl("input", {
      type: "radio",
      attr: {
        name: "preset-type",
        id: "preset-type-tag",
        value: "tag"
      }
    });
    typeSettingControl.createEl("label", {
      text: "Tag",
      attr: {
        for: "preset-type-tag"
      }
    });
    folderRadio.addEventListener("change", () => {
      if (folderRadio.checked) {
        this.type = "folder";
      }
    });
    tagRadio.addEventListener("change", () => {
      if (tagRadio.checked) {
        this.type = "tag";
      }
    });
    const targetSetting = form.createDiv();
    targetSetting.addClass("setting-item");
    const targetSettingInfo = targetSetting.createDiv();
    targetSettingInfo.addClass("setting-item-info");
    targetSettingInfo.createEl("div", {
      text: "Target",
      cls: "setting-item-name"
    });
    targetSettingInfo.createEl("div", {
      text: "Enter the folder path or tag name",
      cls: "setting-item-description"
    });
    const targetSettingControl = targetSetting.createDiv();
    targetSettingControl.addClass("setting-item-control");
    this.targetInput = targetSettingControl.createEl("input", {
      type: "text",
      value: "",
      placeholder: "Enter folder path or tag name"
    });
    this.targetInput.addClass("target-input");
    const footerEl = contentEl.createDiv();
    footerEl.addClass("modal-button-container");
    footerEl.createEl("button", {
      text: "Cancel",
      cls: "mod-warning",
      attr: {
        type: "button"
      }
    }).addEventListener("click", () => {
      this.close();
    });
    footerEl.createEl("button", {
      text: "Save",
      cls: "mod-cta",
      attr: {
        type: "submit"
      }
    }).addEventListener("click", (e) => {
      e.preventDefault();
      this.save();
    });
  }
  save() {
    const target = this.targetInput.value.trim();
    if (target) {
      this.saveCallback(this.type, target);
      this.close();
    }
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
var main = {};
Object.defineProperty(main, "__esModule", { value: true });
var obsidian = require$$0;
const DEFAULT_DAILY_NOTE_FORMAT = "YYYY-MM-DD";
const DEFAULT_WEEKLY_NOTE_FORMAT = "gggg-[W]ww";
const DEFAULT_MONTHLY_NOTE_FORMAT = "YYYY-MM";
const DEFAULT_QUARTERLY_NOTE_FORMAT = "YYYY-[Q]Q";
const DEFAULT_YEARLY_NOTE_FORMAT = "YYYY";
function shouldUsePeriodicNotesSettings(periodicity) {
  var _a, _b;
  const periodicNotes = window.app.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a[periodicity]) == null ? void 0 : _b.enabled);
}
function getDailyNoteSettings() {
  var _a, _b, _c, _d;
  try {
    const { internalPlugins, plugins } = window.app;
    if (shouldUsePeriodicNotesSettings("daily")) {
      const { format: format2, folder: folder2, template: template2 } = ((_b = (_a = plugins.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.daily) || {};
      return {
        format: format2 || DEFAULT_DAILY_NOTE_FORMAT,
        folder: (folder2 == null ? void 0 : folder2.trim()) || "",
        template: (template2 == null ? void 0 : template2.trim()) || ""
      };
    }
    const { folder, format, template } = ((_d = (_c = internalPlugins.getPluginById("daily-notes")) == null ? void 0 : _c.instance) == null ? void 0 : _d.options) || {};
    return {
      format: format || DEFAULT_DAILY_NOTE_FORMAT,
      folder: (folder == null ? void 0 : folder.trim()) || "",
      template: (template == null ? void 0 : template.trim()) || ""
    };
  } catch (err) {
    console.info("No custom daily note settings found!", err);
  }
}
function getWeeklyNoteSettings() {
  var _a, _b, _c, _d, _e, _f, _g;
  try {
    const pluginManager = window.app.plugins;
    const calendarSettings = (_a = pluginManager.getPlugin("calendar")) == null ? void 0 : _a.options;
    const periodicNotesSettings = (_c = (_b = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _b.settings) == null ? void 0 : _c.weekly;
    if (shouldUsePeriodicNotesSettings("weekly")) {
      return {
        format: periodicNotesSettings.format || DEFAULT_WEEKLY_NOTE_FORMAT,
        folder: ((_d = periodicNotesSettings.folder) == null ? void 0 : _d.trim()) || "",
        template: ((_e = periodicNotesSettings.template) == null ? void 0 : _e.trim()) || ""
      };
    }
    const settings = calendarSettings || {};
    return {
      format: settings.weeklyNoteFormat || DEFAULT_WEEKLY_NOTE_FORMAT,
      folder: ((_f = settings.weeklyNoteFolder) == null ? void 0 : _f.trim()) || "",
      template: ((_g = settings.weeklyNoteTemplate) == null ? void 0 : _g.trim()) || ""
    };
  } catch (err) {
    console.info("No custom weekly note settings found!", err);
  }
}
function getMonthlyNoteSettings() {
  var _a, _b, _c, _d;
  const pluginManager = window.app.plugins;
  try {
    const settings = shouldUsePeriodicNotesSettings("monthly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.monthly) || {};
    return {
      format: settings.format || DEFAULT_MONTHLY_NOTE_FORMAT,
      folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
      template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
    };
  } catch (err) {
    console.info("No custom monthly note settings found!", err);
  }
}
function getQuarterlyNoteSettings() {
  var _a, _b, _c, _d;
  const pluginManager = window.app.plugins;
  try {
    const settings = shouldUsePeriodicNotesSettings("quarterly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.quarterly) || {};
    return {
      format: settings.format || DEFAULT_QUARTERLY_NOTE_FORMAT,
      folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
      template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
    };
  } catch (err) {
    console.info("No custom quarterly note settings found!", err);
  }
}
function getYearlyNoteSettings() {
  var _a, _b, _c, _d;
  const pluginManager = window.app.plugins;
  try {
    const settings = shouldUsePeriodicNotesSettings("yearly") && ((_b = (_a = pluginManager.getPlugin("periodic-notes")) == null ? void 0 : _a.settings) == null ? void 0 : _b.yearly) || {};
    return {
      format: settings.format || DEFAULT_YEARLY_NOTE_FORMAT,
      folder: ((_c = settings.folder) == null ? void 0 : _c.trim()) || "",
      template: ((_d = settings.template) == null ? void 0 : _d.trim()) || ""
    };
  } catch (err) {
    console.info("No custom yearly note settings found!", err);
  }
}
function join(...partSegments) {
  let parts = [];
  for (let i = 0, l = partSegments.length; i < l; i++) {
    parts = parts.concat(partSegments[i].split("/"));
  }
  const newParts = [];
  for (let i = 0, l = parts.length; i < l; i++) {
    const part = parts[i];
    if (!part || part === ".")
      continue;
    else
      newParts.push(part);
  }
  if (parts[0] === "")
    newParts.unshift("");
  return newParts.join("/");
}
function basename(fullPath) {
  let base = fullPath.substring(fullPath.lastIndexOf("/") + 1);
  if (base.lastIndexOf(".") != -1)
    base = base.substring(0, base.lastIndexOf("."));
  return base;
}
async function ensureFolderExists(path) {
  const dirs = path.replace(/\\/g, "/").split("/");
  dirs.pop();
  if (dirs.length) {
    const dir = join(...dirs);
    if (!window.app.vault.getAbstractFileByPath(dir)) {
      await window.app.vault.createFolder(dir);
    }
  }
}
async function getNotePath(directory, filename) {
  if (!filename.endsWith(".md")) {
    filename += ".md";
  }
  const path = obsidian.normalizePath(join(directory, filename));
  await ensureFolderExists(path);
  return path;
}
async function getTemplateInfo(template) {
  const { metadataCache, vault } = window.app;
  const templatePath = obsidian.normalizePath(template);
  if (templatePath === "/") {
    return Promise.resolve(["", null]);
  }
  try {
    const templateFile = metadataCache.getFirstLinkpathDest(templatePath, "");
    const contents = await vault.cachedRead(templateFile);
    const IFoldInfo = window.app.foldManager.load(templateFile);
    return [contents, IFoldInfo];
  } catch (err) {
    console.error(`Failed to read the daily note template '${templatePath}'`, err);
    new obsidian.Notice("Failed to read the daily note template");
    return ["", null];
  }
}
function getDateUID(date, granularity = "day") {
  const ts = date.clone().startOf(granularity).format();
  return `${granularity}-${ts}`;
}
function removeEscapedCharacters(format) {
  return format.replace(/\[[^\]]*\]/g, "");
}
function isFormatAmbiguous(format, granularity) {
  if (granularity === "week") {
    const cleanFormat = removeEscapedCharacters(format);
    return /w{1,2}/i.test(cleanFormat) && (/M{1,4}/.test(cleanFormat) || /D{1,4}/.test(cleanFormat));
  }
  return false;
}
function getDateFromFile(file, granularity) {
  return getDateFromFilename(file.basename, granularity);
}
function getDateFromPath(path, granularity) {
  return getDateFromFilename(basename(path), granularity);
}
function getDateFromFilename(filename, granularity) {
  const getSettings = {
    day: getDailyNoteSettings,
    week: getWeeklyNoteSettings,
    month: getMonthlyNoteSettings,
    quarter: getQuarterlyNoteSettings,
    year: getYearlyNoteSettings
  };
  const format = getSettings[granularity]().format.split("/").pop();
  const noteDate = window.moment(filename, format, true);
  if (!noteDate.isValid()) {
    return null;
  }
  if (isFormatAmbiguous(format, granularity)) {
    if (granularity === "week") {
      const cleanFormat = removeEscapedCharacters(format);
      if (/w{1,2}/i.test(cleanFormat)) {
        return window.moment(
          filename,
          // If format contains week, remove day & month formatting
          format.replace(/M{1,4}/g, "").replace(/D{1,4}/g, ""),
          false
        );
      }
    }
  }
  return noteDate;
}
class DailyNotesFolderMissingError extends Error {
}
async function createDailyNote(date) {
  const app2 = window.app;
  const { vault } = app2;
  const moment = window.moment;
  const { template, format, folder } = getDailyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);
  try {
    const createdFile = await vault.create(normalizedPath, templateContents.replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename).replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
      const now = moment();
      const currentDate = date.clone().set({
        hour: now.get("hour"),
        minute: now.get("minute"),
        second: now.get("second")
      });
      if (calc) {
        currentDate.add(parseInt(timeDelta, 10), unit);
      }
      if (momentFormat) {
        return currentDate.format(momentFormat.substring(1).trim());
      }
      return currentDate.format(format);
    }).replace(/{{\s*yesterday\s*}}/gi, date.clone().subtract(1, "day").format(format)).replace(/{{\s*tomorrow\s*}}/gi, date.clone().add(1, "d").format(format)));
    app2.foldManager.save(createdFile, IFoldInfo);
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new obsidian.Notice("Unable to create new file.");
  }
}
function getDailyNote(date, dailyNotes) {
  return dailyNotes[getDateUID(date, "day")] ?? null;
}
function getAllDailyNotes() {
  const { vault } = window.app;
  const { folder } = getDailyNoteSettings();
  const dailyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
  if (!dailyNotesFolder) {
    throw new DailyNotesFolderMissingError("Failed to find daily notes folder");
  }
  const dailyNotes = {};
  obsidian.Vault.recurseChildren(dailyNotesFolder, (note) => {
    if (note instanceof obsidian.TFile) {
      const date = getDateFromFile(note, "day");
      if (date) {
        const dateString = getDateUID(date, "day");
        dailyNotes[dateString] = note;
      }
    }
  });
  return dailyNotes;
}
class WeeklyNotesFolderMissingError extends Error {
}
function getDaysOfWeek() {
  const { moment } = window;
  let weekStart = moment.localeData()._week.dow;
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  while (weekStart) {
    daysOfWeek.push(daysOfWeek.shift());
    weekStart--;
  }
  return daysOfWeek;
}
function getDayOfWeekNumericalValue(dayOfWeekName) {
  return getDaysOfWeek().indexOf(dayOfWeekName.toLowerCase());
}
async function createWeeklyNote(date) {
  const { vault } = window.app;
  const { template, format, folder } = getWeeklyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);
  try {
    const createdFile = await vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
      const now = window.moment();
      const currentDate = date.clone().set({
        hour: now.get("hour"),
        minute: now.get("minute"),
        second: now.get("second")
      });
      if (calc) {
        currentDate.add(parseInt(timeDelta, 10), unit);
      }
      if (momentFormat) {
        return currentDate.format(momentFormat.substring(1).trim());
      }
      return currentDate.format(format);
    }).replace(/{{\s*title\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\s*:(.*?)}}/gi, (_, dayOfWeek, momentFormat) => {
      const day = getDayOfWeekNumericalValue(dayOfWeek);
      return date.weekday(day).format(momentFormat.trim());
    }));
    window.app.foldManager.save(createdFile, IFoldInfo);
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new obsidian.Notice("Unable to create new file.");
  }
}
function getWeeklyNote(date, weeklyNotes) {
  return weeklyNotes[getDateUID(date, "week")] ?? null;
}
function getAllWeeklyNotes() {
  const weeklyNotes = {};
  if (!appHasWeeklyNotesPluginLoaded()) {
    return weeklyNotes;
  }
  const { vault } = window.app;
  const { folder } = getWeeklyNoteSettings();
  const weeklyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
  if (!weeklyNotesFolder) {
    throw new WeeklyNotesFolderMissingError("Failed to find weekly notes folder");
  }
  obsidian.Vault.recurseChildren(weeklyNotesFolder, (note) => {
    if (note instanceof obsidian.TFile) {
      const date = getDateFromFile(note, "week");
      if (date) {
        const dateString = getDateUID(date, "week");
        weeklyNotes[dateString] = note;
      }
    }
  });
  return weeklyNotes;
}
class MonthlyNotesFolderMissingError extends Error {
}
async function createMonthlyNote(date) {
  const { vault } = window.app;
  const { template, format, folder } = getMonthlyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);
  try {
    const createdFile = await vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
      const now = window.moment();
      const currentDate = date.clone().set({
        hour: now.get("hour"),
        minute: now.get("minute"),
        second: now.get("second")
      });
      if (calc) {
        currentDate.add(parseInt(timeDelta, 10), unit);
      }
      if (momentFormat) {
        return currentDate.format(momentFormat.substring(1).trim());
      }
      return currentDate.format(format);
    }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
    window.app.foldManager.save(createdFile, IFoldInfo);
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new obsidian.Notice("Unable to create new file.");
  }
}
function getMonthlyNote(date, monthlyNotes) {
  return monthlyNotes[getDateUID(date, "month")] ?? null;
}
function getAllMonthlyNotes() {
  const monthlyNotes = {};
  if (!appHasMonthlyNotesPluginLoaded()) {
    return monthlyNotes;
  }
  const { vault } = window.app;
  const { folder } = getMonthlyNoteSettings();
  const monthlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
  if (!monthlyNotesFolder) {
    throw new MonthlyNotesFolderMissingError("Failed to find monthly notes folder");
  }
  obsidian.Vault.recurseChildren(monthlyNotesFolder, (note) => {
    if (note instanceof obsidian.TFile) {
      const date = getDateFromFile(note, "month");
      if (date) {
        const dateString = getDateUID(date, "month");
        monthlyNotes[dateString] = note;
      }
    }
  });
  return monthlyNotes;
}
class QuarterlyNotesFolderMissingError extends Error {
}
async function createQuarterlyNote(date) {
  const { vault } = window.app;
  const { template, format, folder } = getQuarterlyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);
  try {
    const createdFile = await vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
      const now = window.moment();
      const currentDate = date.clone().set({
        hour: now.get("hour"),
        minute: now.get("minute"),
        second: now.get("second")
      });
      if (calc) {
        currentDate.add(parseInt(timeDelta, 10), unit);
      }
      if (momentFormat) {
        return currentDate.format(momentFormat.substring(1).trim());
      }
      return currentDate.format(format);
    }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
    window.app.foldManager.save(createdFile, IFoldInfo);
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new obsidian.Notice("Unable to create new file.");
  }
}
function getQuarterlyNote(date, quarterly) {
  return quarterly[getDateUID(date, "quarter")] ?? null;
}
function getAllQuarterlyNotes() {
  const quarterly = {};
  if (!appHasQuarterlyNotesPluginLoaded()) {
    return quarterly;
  }
  const { vault } = window.app;
  const { folder } = getQuarterlyNoteSettings();
  const quarterlyFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
  if (!quarterlyFolder) {
    throw new QuarterlyNotesFolderMissingError("Failed to find quarterly notes folder");
  }
  obsidian.Vault.recurseChildren(quarterlyFolder, (note) => {
    if (note instanceof obsidian.TFile) {
      const date = getDateFromFile(note, "quarter");
      if (date) {
        const dateString = getDateUID(date, "quarter");
        quarterly[dateString] = note;
      }
    }
  });
  return quarterly;
}
class YearlyNotesFolderMissingError extends Error {
}
async function createYearlyNote(date) {
  const { vault } = window.app;
  const { template, format, folder } = getYearlyNoteSettings();
  const [templateContents, IFoldInfo] = await getTemplateInfo(template);
  const filename = date.format(format);
  const normalizedPath = await getNotePath(folder, filename);
  try {
    const createdFile = await vault.create(normalizedPath, templateContents.replace(/{{\s*(date|time)\s*(([+-]\d+)([yqmwdhs]))?\s*(:.+?)?}}/gi, (_, _timeOrDate, calc, timeDelta, unit, momentFormat) => {
      const now = window.moment();
      const currentDate = date.clone().set({
        hour: now.get("hour"),
        minute: now.get("minute"),
        second: now.get("second")
      });
      if (calc) {
        currentDate.add(parseInt(timeDelta, 10), unit);
      }
      if (momentFormat) {
        return currentDate.format(momentFormat.substring(1).trim());
      }
      return currentDate.format(format);
    }).replace(/{{\s*date\s*}}/gi, filename).replace(/{{\s*time\s*}}/gi, window.moment().format("HH:mm")).replace(/{{\s*title\s*}}/gi, filename));
    window.app.foldManager.save(createdFile, IFoldInfo);
    return createdFile;
  } catch (err) {
    console.error(`Failed to create file: '${normalizedPath}'`, err);
    new obsidian.Notice("Unable to create new file.");
  }
}
function getYearlyNote(date, yearlyNotes) {
  return yearlyNotes[getDateUID(date, "year")] ?? null;
}
function getAllYearlyNotes() {
  const yearlyNotes = {};
  if (!appHasYearlyNotesPluginLoaded()) {
    return yearlyNotes;
  }
  const { vault } = window.app;
  const { folder } = getYearlyNoteSettings();
  const yearlyNotesFolder = vault.getAbstractFileByPath(obsidian.normalizePath(folder));
  if (!yearlyNotesFolder) {
    throw new YearlyNotesFolderMissingError("Failed to find yearly notes folder");
  }
  obsidian.Vault.recurseChildren(yearlyNotesFolder, (note) => {
    if (note instanceof obsidian.TFile) {
      const date = getDateFromFile(note, "year");
      if (date) {
        const dateString = getDateUID(date, "year");
        yearlyNotes[dateString] = note;
      }
    }
  });
  return yearlyNotes;
}
function appHasDailyNotesPluginLoaded() {
  var _a, _b;
  const { app: app2 } = window;
  const dailyNotesPlugin = app2.internalPlugins.plugins["daily-notes"];
  if (dailyNotesPlugin && dailyNotesPlugin.enabled) {
    return true;
  }
  const periodicNotes = app2.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.daily) == null ? void 0 : _b.enabled);
}
function appHasWeeklyNotesPluginLoaded() {
  var _a, _b;
  const { app: app2 } = window;
  if (app2.plugins.getPlugin("calendar")) {
    return true;
  }
  const periodicNotes = app2.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.weekly) == null ? void 0 : _b.enabled);
}
function appHasMonthlyNotesPluginLoaded() {
  var _a, _b;
  const { app: app2 } = window;
  const periodicNotes = app2.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.monthly) == null ? void 0 : _b.enabled);
}
function appHasQuarterlyNotesPluginLoaded() {
  var _a, _b;
  const { app: app2 } = window;
  const periodicNotes = app2.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.quarterly) == null ? void 0 : _b.enabled);
}
function appHasYearlyNotesPluginLoaded() {
  var _a, _b;
  const { app: app2 } = window;
  const periodicNotes = app2.plugins.getPlugin("periodic-notes");
  return periodicNotes && ((_b = (_a = periodicNotes.settings) == null ? void 0 : _a.yearly) == null ? void 0 : _b.enabled);
}
function getPeriodicNoteSettings(granularity) {
  const getSettings = {
    day: getDailyNoteSettings,
    week: getWeeklyNoteSettings,
    month: getMonthlyNoteSettings,
    quarter: getQuarterlyNoteSettings,
    year: getYearlyNoteSettings
  }[granularity];
  return getSettings();
}
function createPeriodicNote(granularity, date) {
  const createFn = {
    day: createDailyNote,
    month: createMonthlyNote,
    week: createWeeklyNote
  };
  return createFn[granularity](date);
}
var DEFAULT_DAILY_NOTE_FORMAT_1 = main.DEFAULT_DAILY_NOTE_FORMAT = DEFAULT_DAILY_NOTE_FORMAT;
main.DEFAULT_MONTHLY_NOTE_FORMAT = DEFAULT_MONTHLY_NOTE_FORMAT;
main.DEFAULT_QUARTERLY_NOTE_FORMAT = DEFAULT_QUARTERLY_NOTE_FORMAT;
main.DEFAULT_WEEKLY_NOTE_FORMAT = DEFAULT_WEEKLY_NOTE_FORMAT;
main.DEFAULT_YEARLY_NOTE_FORMAT = DEFAULT_YEARLY_NOTE_FORMAT;
main.appHasDailyNotesPluginLoaded = appHasDailyNotesPluginLoaded;
main.appHasMonthlyNotesPluginLoaded = appHasMonthlyNotesPluginLoaded;
main.appHasQuarterlyNotesPluginLoaded = appHasQuarterlyNotesPluginLoaded;
main.appHasWeeklyNotesPluginLoaded = appHasWeeklyNotesPluginLoaded;
main.appHasYearlyNotesPluginLoaded = appHasYearlyNotesPluginLoaded;
var createDailyNote_1 = main.createDailyNote = createDailyNote;
main.createMonthlyNote = createMonthlyNote;
main.createPeriodicNote = createPeriodicNote;
main.createQuarterlyNote = createQuarterlyNote;
main.createWeeklyNote = createWeeklyNote;
main.createYearlyNote = createYearlyNote;
var getAllDailyNotes_1 = main.getAllDailyNotes = getAllDailyNotes;
main.getAllMonthlyNotes = getAllMonthlyNotes;
main.getAllQuarterlyNotes = getAllQuarterlyNotes;
main.getAllWeeklyNotes = getAllWeeklyNotes;
main.getAllYearlyNotes = getAllYearlyNotes;
var getDailyNote_1 = main.getDailyNote = getDailyNote;
var getDailyNoteSettings_1 = main.getDailyNoteSettings = getDailyNoteSettings;
var getDateFromFile_1 = main.getDateFromFile = getDateFromFile;
main.getDateFromPath = getDateFromPath;
main.getDateUID = getDateUID;
main.getMonthlyNote = getMonthlyNote;
main.getMonthlyNoteSettings = getMonthlyNoteSettings;
main.getPeriodicNoteSettings = getPeriodicNoteSettings;
main.getQuarterlyNote = getQuarterlyNote;
main.getQuarterlyNoteSettings = getQuarterlyNoteSettings;
main.getTemplateInfo = getTemplateInfo;
main.getWeeklyNote = getWeeklyNote;
main.getWeeklyNoteSettings = getWeeklyNoteSettings;
main.getYearlyNote = getYearlyNote;
main.getYearlyNoteSettings = getYearlyNoteSettings;
function getEditor(leaf) {
  if (!leaf)
    return null;
  const view2 = leaf.view;
  if (!(view2 instanceof require$$0.MarkdownView))
    return null;
  return view2.editor;
}
function findAdjacentLeaf(app2, currentLeaf, direction) {
  if (!currentLeaf || !isDailyNoteLeaf(currentLeaf))
    return null;
  const dailyNoteLeaves = [];
  app2.workspace.iterateAllLeaves((leaf) => {
    if (isDailyNoteLeaf(leaf)) {
      dailyNoteLeaves.push(leaf);
    }
  });
  dailyNoteLeaves.sort((a, b) => {
    const rectA = a.containerEl.getBoundingClientRect();
    const rectB = b.containerEl.getBoundingClientRect();
    return rectA.top - rectB.top;
  });
  const currentIndex = dailyNoteLeaves.findIndex(
    (leaf) => leaf === currentLeaf
  );
  if (currentIndex === -1)
    return null;
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  return targetIndex >= 0 && targetIndex < dailyNoteLeaves.length ? dailyNoteLeaves[targetIndex] : null;
}
function navigateToAdjacentLeaf(app2, currentLeaf, direction) {
  const targetLeaf = findAdjacentLeaf(app2, currentLeaf, direction);
  if (!targetLeaf)
    return false;
  app2.workspace.setActiveLeaf(targetLeaf, { focus: true });
  const editor = getEditor(targetLeaf);
  if (!editor)
    return false;
  let pos;
  if (direction === "up") {
    const lastLine = editor.lastLine();
    const lastLineLength = editor.getLine(lastLine).length;
    pos = { line: lastLine, ch: lastLineLength };
  } else {
    pos = { line: 0, ch: 0 };
  }
  editor.setCursor(pos);
  editor.scrollIntoView(
    {
      from: pos,
      to: pos
    },
    true
  );
  setTimeout(() => {
    if (targetLeaf.view instanceof require$$0.MarkdownView) {
      if (targetLeaf.view.editMode && targetLeaf.view.editMode.editor) {
        targetLeaf.view.editMode.editor.focus();
      } else {
        editor.focus();
      }
    }
  }, 10);
  return true;
}
function isFrontmatterHidden(plugin) {
  var _a;
  return ((_a = plugin.settings) == null ? void 0 : _a.hideFrontmatter) === true;
}
function isAtFirstVisibleLine(view2, file, app2, plugin) {
  var _a, _b;
  if (!isFrontmatterHidden(plugin)) {
    const pos2 = view2.state.selection.main.head;
    const line2 = view2.state.doc.lineAt(pos2);
    return line2.number === 1 && pos2 === line2.from;
  }
  const pos = view2.state.selection.main.head;
  const line = view2.state.doc.lineAt(pos);
  const fileCache = app2.metadataCache.getFileCache(file);
  if (!fileCache || !fileCache.frontmatter) {
    return line.number === 1 && pos === line.from;
  }
  const frontmatterEndLine = (((_b = (_a = fileCache.frontmatterPosition) == null ? void 0 : _a.end) == null ? void 0 : _b.line) ?? 0) + 2;
  return line.number === frontmatterEndLine && pos === line.from;
}
function createUpDownNavigationExtension(options) {
  const { app: app2, plugin } = options;
  const keyBindings = [
    {
      key: "ArrowUp",
      run: (view2) => {
        var _a;
        if (!view2.state)
          return false;
        const infoView = view2.state.field(require$$0.editorInfoField);
        const currentLeaf = infoView == null ? void 0 : infoView.leaf;
        const currentFile = (_a = currentLeaf == null ? void 0 : currentLeaf.view) == null ? void 0 : _a.file;
        if (currentFile && isAtFirstVisibleLine(view2, currentFile, app2, plugin)) {
          if (currentLeaf && navigateToAdjacentLeaf(app2, currentLeaf, "up")) {
            return true;
          }
        }
        return false;
      }
    },
    {
      key: "ArrowDown",
      run: (view2) => {
        if (!view2.state)
          return false;
        const pos = view2.state.selection.main.head;
        const line = view2.state.doc.lineAt(pos);
        const infoView = view2.state.field(require$$0.editorInfoField);
        const currentLeaf = infoView == null ? void 0 : infoView.leaf;
        const lastLineNumber = view2.state.doc.lines;
        if (line.number === lastLineNumber && pos === line.to) {
          if (currentLeaf && navigateToAdjacentLeaf(app2, currentLeaf, "down")) {
            return true;
          }
        }
        return false;
      }
    }
  ];
  return state.Prec.highest(view.keymap.of(keyBindings));
}
function noop() {
}
function run$1(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all$1(fns) {
  fns.forEach(run$1);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, "");
  }
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
const dirty_components$1 = [];
const binding_callbacks$1 = [];
let render_callbacks$1 = [];
const flush_callbacks$1 = [];
const resolved_promise$1 = /* @__PURE__ */ Promise.resolve();
let update_scheduled$1 = false;
function schedule_update$1() {
  if (!update_scheduled$1) {
    update_scheduled$1 = true;
    resolved_promise$1.then(flush$1);
  }
}
function add_render_callback$1(fn) {
  render_callbacks$1.push(fn);
}
const seen_callbacks$1 = /* @__PURE__ */ new Set();
let flushidx$1 = 0;
function flush$1() {
  if (flushidx$1 !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx$1 < dirty_components$1.length) {
        const component = dirty_components$1[flushidx$1];
        flushidx$1++;
        set_current_component(component);
        update$1(component.$$);
      }
    } catch (e) {
      dirty_components$1.length = 0;
      flushidx$1 = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components$1.length = 0;
    flushidx$1 = 0;
    while (binding_callbacks$1.length)
      binding_callbacks$1.pop()();
    for (let i = 0; i < render_callbacks$1.length; i += 1) {
      const callback = render_callbacks$1[i];
      if (!seen_callbacks$1.has(callback)) {
        seen_callbacks$1.add(callback);
        callback();
      }
    }
    render_callbacks$1.length = 0;
  } while (dirty_components$1.length);
  while (flush_callbacks$1.length) {
    flush_callbacks$1.pop()();
  }
  update_scheduled$1 = false;
  seen_callbacks$1.clear();
  set_current_component(saved_component);
}
function update$1($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all$1($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback$1);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks$1.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks$1 = filtered;
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all$1(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  const updates = [];
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else {
      updates.push(() => block.p(child_ctx, dirty));
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  run_all$1(updates);
  return new_blocks;
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback$1(() => {
    const new_on_destroy = component.$$.on_mount.map(run$1).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all$1(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback$1);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all$1($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components$1.push(component);
    schedule_update$1();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all$1($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush$1();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
function create_if_block_2$1(ctx) {
  let div;
  let span0;
  let svg;
  let path;
  let span0_title_value;
  let t0;
  let span1;
  let t1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      span0 = element("span");
      svg = svg_element("svg");
      path = svg_element("path");
      t0 = space();
      span1 = element("span");
      t1 = text(
        /*title*/
        ctx[5]
      );
      attr(path, "d", "m6 9 6 6 6-6");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "width", "24");
      attr(svg, "height", "24");
      attr(svg, "viewBox", "0 0 24 24");
      attr(svg, "fill", "none");
      attr(svg, "stroke", "currentColor");
      attr(svg, "stroke-width", "2");
      attr(svg, "stroke-linecap", "round");
      attr(svg, "stroke-linejoin", "round");
      attr(svg, "class", "lucide lucide-chevron-down");
      attr(span0, "role", "button");
      attr(
        span0,
        "data-collapsed",
        /*isCollapsed*/
        ctx[7]
      );
      attr(span0, "class", "collapse-button svelte-1d2sruf");
      attr(span0, "title", span0_title_value = /*isCollapsed*/
      ctx[7] ? "Expand" : "Collapse");
      attr(span1, "role", "link");
      attr(span1, "class", "clickable-link svelte-1d2sruf");
      attr(
        span1,
        "data-title",
        /*title*/
        ctx[5]
      );
      attr(div, "class", "daily-note-title inline-title svelte-1d2sruf");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span0);
      append(span0, svg);
      append(svg, path);
      append(div, t0);
      append(div, span1);
      append(span1, t1);
      if (!mounted) {
        dispose = [
          listen(
            span0,
            "click",
            /*toggleCollapse*/
            ctx[10]
          ),
          listen(
            span1,
            "click",
            /*handleFileIconClick*/
            ctx[8]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*isCollapsed*/
      128) {
        attr(
          span0,
          "data-collapsed",
          /*isCollapsed*/
          ctx2[7]
        );
      }
      if (dirty & /*isCollapsed*/
      128 && span0_title_value !== (span0_title_value = /*isCollapsed*/
      ctx2[7] ? "Expand" : "Collapse")) {
        attr(span0, "title", span0_title_value);
      }
      if (dirty & /*title*/
      32)
        set_data(
          t1,
          /*title*/
          ctx2[5]
        );
      if (dirty & /*title*/
      32) {
        attr(
          span1,
          "data-title",
          /*title*/
          ctx2[5]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      run_all$1(dispose);
    }
  };
}
function create_if_block_1$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Loading...";
      attr(div, "class", "editor-placeholder svelte-1d2sruf");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_if_block$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Scroll to view content";
      attr(div, "class", "editor-placeholder svelte-1d2sruf");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment$1(ctx) {
  let div2;
  let div1;
  let t0;
  let div0;
  let t1;
  let div2_data_id_value;
  let mounted;
  let dispose;
  let if_block0 = (
    /*title*/
    ctx[5] && create_if_block_2$1(ctx)
  );
  let if_block1 = !/*rendered*/
  ctx[3] && /*shouldRender*/
  ctx[1] && create_if_block_1$1();
  let if_block2 = !/*shouldRender*/
  ctx[1] && !/*rendered*/
  ctx[3] && create_if_block$1();
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      div0 = element("div");
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      attr(div0, "class", "daily-note-editor svelte-1d2sruf");
      attr(
        div0,
        "data-collapsed",
        /*isCollapsed*/
        ctx[7]
      );
      attr(div0, "aria-hidden", "true");
      attr(
        div0,
        "data-title",
        /*title*/
        ctx[5]
      );
      attr(div1, "class", "daily-note svelte-1d2sruf");
      attr(div2, "class", "daily-note-container");
      attr(div2, "data-id", div2_data_id_value = "dn-editor-" + /*file*/
      ctx[0].path);
      set_style(
        div2,
        "min-height",
        /*isCollapsed*/
        ctx[7] ? "auto" : (
          /*editorHeight*/
          ctx[6] + "px"
        )
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      if (if_block0)
        if_block0.m(div1, null);
      append(div1, t0);
      append(div1, div0);
      if (if_block1)
        if_block1.m(div0, null);
      append(div0, t1);
      if (if_block2)
        if_block2.m(div0, null);
      ctx[13](div0);
      ctx[14](div2);
      if (!mounted) {
        dispose = listen(
          div0,
          "click",
          /*handleEditorClick*/
          ctx[9]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*title*/
        ctx2[5]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_2$1(ctx2);
          if_block0.c();
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (!/*rendered*/
      ctx2[3] && /*shouldRender*/
      ctx2[1]) {
        if (if_block1)
          ;
        else {
          if_block1 = create_if_block_1$1();
          if_block1.c();
          if_block1.m(div0, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (!/*shouldRender*/
      ctx2[1] && !/*rendered*/
      ctx2[3]) {
        if (if_block2)
          ;
        else {
          if_block2 = create_if_block$1();
          if_block2.c();
          if_block2.m(div0, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
      if (dirty & /*isCollapsed*/
      128) {
        attr(
          div0,
          "data-collapsed",
          /*isCollapsed*/
          ctx2[7]
        );
      }
      if (dirty & /*title*/
      32) {
        attr(
          div0,
          "data-title",
          /*title*/
          ctx2[5]
        );
      }
      if (dirty & /*file*/
      1 && div2_data_id_value !== (div2_data_id_value = "dn-editor-" + /*file*/
      ctx2[0].path)) {
        attr(div2, "data-id", div2_data_id_value);
      }
      if (dirty & /*isCollapsed, editorHeight*/
      192) {
        set_style(
          div2,
          "min-height",
          /*isCollapsed*/
          ctx2[7] ? "auto" : (
            /*editorHeight*/
            ctx2[6] + "px"
          )
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      ctx[13](null);
      ctx[14](null);
      mounted = false;
      dispose();
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { file } = $$props;
  let { plugin } = $$props;
  let { leaf } = $$props;
  let { shouldRender = true } = $$props;
  let editorEl;
  let containerEl;
  let title;
  let rendered = false;
  let createdLeaf;
  let unloadTimeout = null;
  let editorHeight = 100;
  let isDestroying = false;
  let isCollapsed = false;
  onMount(() => {
    if (file instanceof require$$0.TFile) {
      $$invalidate(5, title = file.basename);
    }
  });
  console.log(shouldRender, rendered);
  onDestroy(() => {
    isDestroying = true;
    if (unloadTimeout) {
      window.clearTimeout(unloadTimeout);
    }
    if (rendered && createdLeaf) {
      unloadEditor();
    }
  });
  function showEditor() {
    if (!(file instanceof require$$0.TFile))
      return;
    if (rendered)
      return;
    if (isDestroying)
      return;
    if (unloadTimeout) {
      window.clearTimeout(unloadTimeout);
      unloadTimeout = null;
    }
    try {
      const fileName = file instanceof require$$0.TFile ? file.basename : "unknown";
      console.log(`Loading editor for ${fileName}`);
      [createdLeaf] = spawnLeafView(plugin, editorEl, leaf);
      createdLeaf.setPinned(true);
      createdLeaf.setViewState({
        type: "markdown",
        state: {
          file: file.path,
          mode: "source",
          source: false,
          backlinks: !plugin.settings.hideBacklinks,
          backlinkOpts: {
            collapseAll: false,
            extraContext: false,
            sortOrder: "alphabetical",
            showSearch: false,
            searchQuery: "",
            backlinkCollapsed: false,
            unlinkedCollapsed: true
          }
        }
      });
      createdLeaf.parentLeaf = leaf;
      $$invalidate(3, rendered = true);
      const timeout = window.setTimeout(
        () => {
          var _a, _b, _c;
          if (createdLeaf && containerEl) {
            if (!(createdLeaf.view instanceof require$$0.MarkdownView))
              return;
            const actualHeight = (_c = (_b = (_a = createdLeaf.view.editMode) === null || _a === void 0 ? void 0 : _a.editor) === null || _b === void 0 ? void 0 : _b.cm) === null || _c === void 0 ? void 0 : _c.dom.innerHeight;
            if (actualHeight > 0) {
              $$invalidate(6, editorHeight = actualHeight);
              $$invalidate(4, containerEl.style.minHeight = `${editorHeight}px`, containerEl);
              window.clearTimeout(timeout);
            }
          }
        },
        400
      );
    } catch (error) {
      console.error("Error creating leaf view:", error);
    }
  }
  function scheduleUnload() {
    if (unloadTimeout) {
      window.clearTimeout(unloadTimeout);
    }
    unloadTimeout = window.setTimeout(
      () => {
        if (!shouldRender && rendered) {
          unloadEditor();
        }
      },
      1e3
    );
  }
  function unloadEditor() {
    if (!rendered || !createdLeaf)
      return;
    try {
      const fileName = file instanceof require$$0.TFile ? file.basename : "unknown";
      console.log(`Unloading editor for ${fileName}`);
      if (createdLeaf.detach) {
        createdLeaf.detach();
      }
      if (editorEl) {
        editorEl.empty();
      }
      $$invalidate(3, rendered = false);
    } catch (error) {
      console.error(
        "Error unloading editor:",
        error
      );
    }
  }
  function handleFileIconClick() {
    if (!(file instanceof require$$0.TFile))
      return;
    if (leaf && !(leaf === null || leaf === void 0 ? void 0 : leaf.pinned)) {
      leaf.openFile(file);
    } else
      plugin.app.workspace.getLeaf(false).openFile(file);
  }
  function handleEditorClick() {
    var _a, _b;
    const editor = (_b = (_a = createdLeaf === null || createdLeaf === void 0 ? void 0 : createdLeaf.view) === null || _a === void 0 ? void 0 : _a.editMode) === null || _b === void 0 ? void 0 : _b.editor;
    if (editor && !editor.hasFocus()) {
      editor.focus();
    }
  }
  function toggleCollapse() {
    $$invalidate(7, isCollapsed = !isCollapsed);
  }
  function div0_binding($$value) {
    binding_callbacks$1[$$value ? "unshift" : "push"](() => {
      editorEl = $$value;
      $$invalidate(2, editorEl);
    });
  }
  function div2_binding($$value) {
    binding_callbacks$1[$$value ? "unshift" : "push"](() => {
      containerEl = $$value;
      $$invalidate(4, containerEl);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("file" in $$props2)
      $$invalidate(0, file = $$props2.file);
    if ("plugin" in $$props2)
      $$invalidate(11, plugin = $$props2.plugin);
    if ("leaf" in $$props2)
      $$invalidate(12, leaf = $$props2.leaf);
    if ("shouldRender" in $$props2)
      $$invalidate(1, shouldRender = $$props2.shouldRender);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*editorEl, shouldRender, rendered*/
    14) {
      if (editorEl && shouldRender && !rendered) {
        showEditor();
      } else if (editorEl && !shouldRender && rendered) {
        scheduleUnload();
      }
    }
  };
  return [
    file,
    shouldRender,
    editorEl,
    rendered,
    containerEl,
    title,
    editorHeight,
    isCollapsed,
    handleFileIconClick,
    handleEditorClick,
    toggleCollapse,
    plugin,
    leaf,
    div0_binding,
    div2_binding
  ];
}
class DailyNote extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      file: 0,
      plugin: 11,
      leaf: 12,
      shouldRender: 1
    });
  }
}
function run(fn) {
  return fn();
}
function run_all(fns) {
  fns.forEach(run);
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      update(component.$$);
    }
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const defaultOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0,
  unobserveOnEnter: false
};
const createEvent = (name, detail) => new CustomEvent(name, { detail });
function inview(node, options = {}) {
  const { root, rootMargin, threshold, unobserveOnEnter } = Object.assign(Object.assign({}, defaultOptions), options);
  let prevPos = {
    x: void 0,
    y: void 0
  };
  let scrollDirection = {
    vertical: void 0,
    horizontal: void 0
  };
  if (typeof IntersectionObserver !== "undefined" && node) {
    const observer = new IntersectionObserver((entries, _observer) => {
      entries.forEach((singleEntry) => {
        if (prevPos.y > singleEntry.boundingClientRect.y) {
          scrollDirection.vertical = "up";
        } else {
          scrollDirection.vertical = "down";
        }
        if (prevPos.x > singleEntry.boundingClientRect.x) {
          scrollDirection.horizontal = "left";
        } else {
          scrollDirection.horizontal = "right";
        }
        prevPos = {
          y: singleEntry.boundingClientRect.y,
          x: singleEntry.boundingClientRect.x
        };
        const detail = {
          inView: singleEntry.isIntersecting,
          entry: singleEntry,
          scrollDirection,
          node,
          observer: _observer
        };
        node.dispatchEvent(createEvent("inview_change", detail));
        node.dispatchEvent(createEvent("change", detail));
        if (singleEntry.isIntersecting) {
          node.dispatchEvent(createEvent("inview_enter", detail));
          node.dispatchEvent(createEvent("enter", detail));
          unobserveOnEnter && _observer.unobserve(node);
        } else {
          node.dispatchEvent(createEvent("inview_leave", detail));
          node.dispatchEvent(createEvent("leave", detail));
        }
      });
    }, {
      root,
      rootMargin,
      threshold
    });
    tick().then(() => {
      node.dispatchEvent(createEvent("inview_init", { observer, node }));
      node.dispatchEvent(
        //@ts-expect-error only for backward compatibility
        createEvent("init", { observer, node })
      );
    });
    observer.observe(node);
    return {
      destroy() {
        observer.unobserve(node);
      }
    };
  }
}
class FileManager {
  constructor(options) {
    this.allFiles = [];
    this.filteredFiles = [];
    this.hasFetched = false;
    this.hasCurrentDay = true;
    this.cacheDailyNotes = {};
    this.options = options;
    this.fetchFiles();
  }
  /**
   * Helper method to parse time field and check if it's reverse
   * @param timeField The time field to parse
   * @returns An object containing isReverse flag and baseTimeField
   */
  parseTimeField(timeField) {
    const field = timeField || "mtime";
    const isReverse = field.endsWith("Reverse");
    const baseTimeField = isReverse ? field.replace("Reverse", "") : field;
    return { isReverse, baseTimeField };
  }
  /**
   * Helper method to sort files by time field
   * @param files The files to sort
   * @param timeField The time field to sort by
   * @returns Sorted files
   */
  sortFilesByTimeField(files, timeField) {
    const { isReverse, baseTimeField } = this.parseTimeField(timeField);
    return [...files].sort((a, b) => {
      if (baseTimeField === "name") {
        if (isReverse) {
          return b.name.localeCompare(a.name);
        }
        return a.name.localeCompare(b.name);
      }
      if (isReverse) {
        return a.stat[baseTimeField] - b.stat[baseTimeField];
      }
      return b.stat[baseTimeField] - a.stat[baseTimeField];
    });
  }
  fetchFiles() {
    if (this.hasFetched)
      return;
    switch (this.options.mode) {
      case "daily":
        this.fetchDailyNotes();
        break;
      case "folder":
        this.fetchFolderFiles();
        break;
      case "tag":
        this.fetchTaggedFiles();
        break;
    }
    this.hasFetched = true;
    this.checkDailyNote();
    this.filterFilesByRange();
  }
  fetchDailyNotes() {
    this.cacheDailyNotes = getAllDailyNotes_1();
    const notes = Object.values(this.cacheDailyNotes);
    const { isReverse, baseTimeField } = this.parseTimeField(
      this.options.timeField
    );
    if (baseTimeField === "name") {
      this.allFiles = [...notes].sort((a, b) => {
        const result = a.name.localeCompare(b.name);
        return isReverse ? -result : result;
      });
    } else {
      for (const string of Object.keys(this.cacheDailyNotes).sort().reverse()) {
        this.allFiles.push(this.cacheDailyNotes[string]);
      }
      if (baseTimeField !== "ctime" && baseTimeField !== "mtime") {
        this.allFiles = this.sortFilesByTimeField(
          this.allFiles,
          this.options.timeField
        );
      }
    }
  }
  fetchFolderFiles() {
    if (!this.options.target || !this.options.app)
      return;
    const allFiles = this.options.app.vault.getMarkdownFiles();
    this.allFiles = allFiles.filter((file) => {
      var _a;
      const folderPath = ((_a = file.parent) == null ? void 0 : _a.path) || "";
      return folderPath === this.options.target || folderPath.startsWith(this.options.target + "/");
    });
    this.allFiles = this.sortFilesByTimeField(
      this.allFiles,
      this.options.timeField
    );
  }
  fetchTaggedFiles() {
    if (!this.options.target || !this.options.app)
      return;
    const allFiles = this.options.app.vault.getMarkdownFiles();
    const targetTag = this.options.target.startsWith("#") ? this.options.target : "#" + this.options.target;
    this.allFiles = allFiles.filter((file) => {
      var _a;
      const fileCache = (_a = this.options.app) == null ? void 0 : _a.metadataCache.getFileCache(file);
      if (!fileCache || !fileCache.tags)
        return false;
      return fileCache.tags.some((tag) => tag.tag === targetTag);
    });
    this.allFiles = this.sortFilesByTimeField(
      this.allFiles,
      this.options.timeField
    );
  }
  filterFilesByRange() {
    if (!this.options.timeRange) {
      this.filteredFiles = [...this.allFiles];
      return this.filteredFiles;
    }
    this.filteredFiles = [];
    if (this.options.timeRange === "all") {
      this.filteredFiles = [...this.allFiles];
      return this.filteredFiles;
    }
    if (this.options.mode === "daily") {
      this.filterDailyNotesByRange();
    } else {
      this.filterFilesByTimeRange();
    }
    return this.filteredFiles;
  }
  /**
   * Filter files by time range
   * Applicable to folder and tag modes
   */
  filterFilesByTimeRange() {
    const now = require$$0.moment();
    const { isReverse, baseTimeField } = this.parseTimeField(
      this.options.timeField
    );
    this.filteredFiles = this.allFiles.filter((file) => {
      const fileDate = require$$0.moment(file.stat[baseTimeField]);
      return this.isDateInRange(fileDate, now);
    });
    if (isReverse) {
      this.filteredFiles.reverse();
    }
  }
  /**
   * Filter daily notes by date
   * Applicable to daily mode
   */
  filterDailyNotesByRange() {
    const now = require$$0.moment();
    const fileFormat = getDailyNoteSettings_1().format || DEFAULT_DAILY_NOTE_FORMAT_1;
    this.filteredFiles = this.allFiles.filter((file) => {
      const fileDate = require$$0.moment(file.basename, fileFormat);
      return this.isDateInRange(fileDate, now);
    });
  }
  /**
   * Check if the file date is in the range
   * @param fileDate file date
   * @param now current date
   * @returns whether in the range
   */
  isDateInRange(fileDate, now) {
    switch (this.options.timeRange) {
      case "week":
        return fileDate.isSame(now, "week");
      case "month":
        return fileDate.isSame(now, "month");
      case "year":
        return fileDate.isSame(now, "year");
      case "last-week":
        return fileDate.isBetween(
          require$$0.moment().subtract(1, "week").startOf("week"),
          require$$0.moment().subtract(1, "week").endOf("week"),
          null,
          "[]"
        );
      case "last-month":
        return fileDate.isBetween(
          require$$0.moment().subtract(1, "month").startOf("month"),
          require$$0.moment().subtract(1, "month").endOf("month"),
          null,
          "[]"
        );
      case "last-year":
        return fileDate.isBetween(
          require$$0.moment().subtract(1, "year").startOf("year"),
          require$$0.moment().subtract(1, "year").endOf("year"),
          null,
          "[]"
        );
      case "quarter":
        return fileDate.isSame(now, "quarter");
      case "last-quarter":
        return fileDate.isBetween(
          require$$0.moment().subtract(1, "quarter").startOf("quarter"),
          require$$0.moment().subtract(1, "quarter").endOf("quarter"),
          null,
          "[]"
        );
      case "custom":
        if (this.options.customRange) {
          const startDate = require$$0.moment(this.options.customRange.start);
          const endDate = require$$0.moment(this.options.customRange.end);
          return fileDate.isBetween(startDate, endDate, null, "[]");
        }
        return false;
      default:
        return true;
    }
  }
  checkDailyNote() {
    if (this.options.mode !== "daily") {
      this.hasCurrentDay = true;
      return true;
    }
    this.cacheDailyNotes = getAllDailyNotes_1();
    const currentDate = require$$0.moment();
    const currentDailyNote = getDailyNote_1(
      currentDate,
      this.cacheDailyNotes
    );
    if (!currentDailyNote) {
      this.hasCurrentDay = false;
      return false;
    }
    if (this.hasCurrentDay === false) {
      this.allFiles = [];
      this.fetchDailyNotes();
      this.filterFilesByRange();
    }
    this.hasCurrentDay = true;
    return true;
  }
  async createNewDailyNote() {
    if (this.options.mode !== "daily" || this.hasCurrentDay) {
      return null;
    }
    const currentDate = require$$0.moment();
    const currentDailyNote = await createDailyNote_1(currentDate);
    if (currentDailyNote) {
      this.allFiles.push(currentDailyNote);
      this.allFiles = this.sortDailyNotes(this.allFiles);
      this.hasCurrentDay = true;
      this.filterFilesByRange();
      return currentDailyNote;
    }
    return null;
  }
  fileCreate(file) {
    if (this.options.mode === "daily") {
      this.handleDailyNoteCreate(file);
    } else if (this.options.mode === "folder") {
      this.handleFolderFileCreate(file);
    } else if (this.options.mode === "tag") {
      this.handleTaggedFileCreate(file);
    }
  }
  handleDailyNoteCreate(file) {
    const fileDate = getDateFromFile_1(file, "day");
    const fileFormat = getDailyNoteSettings_1().format || DEFAULT_DAILY_NOTE_FORMAT_1;
    if (!fileDate)
      return;
    if (this.filteredFiles.length === 0) {
      this.allFiles.push(file);
      this.allFiles = this.sortDailyNotes(this.allFiles);
      this.filterFilesByRange();
      return;
    }
    const lastFilteredFile = this.filteredFiles[this.filteredFiles.length - 1];
    const firstFilteredFile = this.filteredFiles[0];
    const lastFilteredFileDate = require$$0.moment(
      lastFilteredFile.basename,
      fileFormat
    );
    const firstFilteredFileDate = require$$0.moment(
      firstFilteredFile.basename,
      fileFormat
    );
    if (fileDate.isBetween(lastFilteredFileDate, firstFilteredFileDate)) {
      this.filteredFiles.push(file);
      this.filteredFiles = this.sortDailyNotes(this.filteredFiles);
    } else if (fileDate.isBefore(lastFilteredFileDate)) {
      this.allFiles.push(file);
      this.allFiles = this.sortDailyNotes(this.allFiles);
      this.filterFilesByRange();
    } else if (fileDate.isAfter(firstFilteredFileDate)) {
      this.filteredFiles.push(file);
      this.filteredFiles = this.sortDailyNotes(this.filteredFiles);
    }
    if (fileDate.isSame(require$$0.moment(), "day"))
      this.hasCurrentDay = true;
  }
  handleFolderFileCreate(file) {
    var _a;
    if (!this.options.target)
      return;
    const folderPath = ((_a = file.parent) == null ? void 0 : _a.path) || "";
    if (folderPath === this.options.target || folderPath.startsWith(this.options.target + "/")) {
      this.allFiles.push(file);
      this.allFiles = this.sortFilesByTimeField(
        this.allFiles,
        this.options.timeField
      );
      this.filterFilesByRange();
    }
  }
  handleTaggedFileCreate(file) {
    if (!this.options.target || !this.options.app)
      return;
    const targetTag = this.options.target.startsWith("#") ? this.options.target : "#" + this.options.target;
    const fileCache = this.options.app.metadataCache.getFileCache(file);
    if (!fileCache || !fileCache.tags)
      return;
    if (fileCache.tags.some((tag) => tag.tag === targetTag)) {
      this.allFiles.push(file);
      this.allFiles = this.sortFilesByTimeField(
        this.allFiles,
        this.options.timeField
      );
      this.filterFilesByRange();
    }
  }
  fileDelete(file) {
    if (this.options.mode === "daily" && getDateFromFile_1(file, "day")) {
      this.filteredFiles = this.filteredFiles.filter((f) => {
        return f.basename !== file.basename;
      });
      this.allFiles = this.allFiles.filter((f) => {
        return f.basename !== file.basename;
      });
      this.filterFilesByRange();
      this.checkDailyNote();
    } else {
      this.filteredFiles = this.filteredFiles.filter((f) => {
        return f.basename !== file.basename;
      });
      this.allFiles = this.allFiles.filter((f) => {
        return f.basename !== file.basename;
      });
    }
  }
  sortDailyNotes(notes) {
    const { isReverse, baseTimeField } = this.parseTimeField(
      this.options.timeField
    );
    if (baseTimeField === "name") {
      return [...notes].sort((a, b) => {
        if (isReverse) {
          return b.name.localeCompare(a.name);
        }
        return a.name.localeCompare(b.name);
      });
    }
    return this.sortFilesByTimeField(notes, this.options.timeField);
  }
  getAllFiles() {
    return this.allFiles;
  }
  getFilteredFiles() {
    return this.filteredFiles;
  }
  hasCurrentDayNote() {
    return this.hasCurrentDay;
  }
  updateOptions(options) {
    this.options = { ...this.options, ...options };
    if (options.timeRange || options.customRange) {
      this.filterFilesByRange();
    }
    if (options.mode || options.target) {
      this.allFiles = [];
      this.filteredFiles = [];
      this.hasFetched = false;
      this.fetchFiles();
    }
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[29] = list[i];
  return child_ctx;
}
function create_if_block_2(ctx) {
  let div1;
  return {
    c() {
      div1 = element("div");
      div1.innerHTML = `<div class="dn-stock-text svelte-4q3cv7">No files found</div>`;
      attr(div1, "class", "dn-stock svelte-4q3cv7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
    }
  };
}
function create_if_block_1(ctx) {
  let div1;
  let mounted;
  let dispose;
  return {
    c() {
      div1 = element("div");
      div1.innerHTML = `<div class="dn-blank-day-text svelte-4q3cv7">Create a daily note for today ✍</div>`;
      attr(div1, "class", "dn-blank-day svelte-4q3cv7");
      attr(div1, "aria-hidden", "true");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (!mounted) {
        dispose = listen(
          div1,
          "click",
          /*createNewDailyNote*/
          ctx[12]
        );
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(key_1, ctx) {
  let div;
  let dailynote;
  let inview_action;
  let current;
  let mounted;
  let dispose;
  dailynote = new DailyNote({
    props: {
      file: (
        /*file*/
        ctx[29]
      ),
      plugin: (
        /*plugin*/
        ctx[0]
      ),
      leaf: (
        /*leaf*/
        ctx[1]
      ),
      shouldRender: (
        /*visibleNotes*/
        ctx[4].has(
          /*file*/
          ctx[29].path
        )
      )
    }
  });
  function inview_change_handler(...args) {
    return (
      /*inview_change_handler*/
      ctx[22](
        /*file*/
        ctx[29],
        ...args
      )
    );
  }
  return {
    key: key_1,
    first: null,
    c() {
      div = element("div");
      create_component(dailynote.$$.fragment);
      attr(div, "class", "daily-note-wrapper svelte-4q3cv7");
      this.first = div;
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(dailynote, div, null);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(inview_action = inview.call(null, div, {
            rootMargin: "80%",
            unobserveOnEnter: false,
            root: (
              /*leaf*/
              ctx[1].view.contentEl
            )
          })),
          listen(div, "inview_change", inview_change_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const dailynote_changes = {};
      if (dirty[0] & /*renderedFiles*/
      64)
        dailynote_changes.file = /*file*/
        ctx[29];
      if (dirty[0] & /*plugin*/
      1)
        dailynote_changes.plugin = /*plugin*/
        ctx[0];
      if (dirty[0] & /*leaf*/
      2)
        dailynote_changes.leaf = /*leaf*/
        ctx[1];
      if (dirty[0] & /*visibleNotes, renderedFiles*/
      80)
        dailynote_changes.shouldRender = /*visibleNotes*/
        ctx[4].has(
          /*file*/
          ctx[29].path
        );
      dailynote.$set(dailynote_changes);
      if (inview_action && is_function(inview_action.update) && dirty[0] & /*leaf*/
      2)
        inview_action.update.call(null, {
          rootMargin: "80%",
          unobserveOnEnter: false,
          root: (
            /*leaf*/
            ctx[1].view.contentEl
          )
        });
    },
    i(local) {
      if (current)
        return;
      transition_in(dailynote.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dailynote.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_component(dailynote);
      mounted = false;
      run_all$1(dispose);
    }
  };
}
function create_if_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "—— No more of results ——";
      attr(div, "class", "no-more-text svelte-4q3cv7");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_fragment(ctx) {
  var _a;
  let div1;
  let t0;
  let show_if = (
    /*selectionMode*/
    ctx[3] === "daily" && !/*fileManager*/
    ((_a = ctx[5]) == null ? void 0 : _a.hasCurrentDayNote()) && /*selectedRange*/
    (ctx[2] === "all" || /*selectedRange*/
    ctx[2] === "week" || /*selectedRange*/
    ctx[2] === "month" || /*selectedRange*/
    ctx[2] === "year" || /*selectedRange*/
    ctx[2] === "quarter")
  );
  let t1;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let t2;
  let div0;
  let inview_action;
  let t3;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*renderedFiles*/
    ctx[6].length === 0 && create_if_block_2()
  );
  let if_block1 = show_if && create_if_block_1(ctx);
  let each_value = ensure_array_like(
    /*renderedFiles*/
    ctx[6]
  );
  const get_key = (ctx2) => (
    /*file*/
    ctx2[29].path
  );
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  let if_block2 = !/*hasMore*/
  ctx[7] && create_if_block();
  return {
    c() {
      div1 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      div0 = element("div");
      t3 = space();
      if (if_block2)
        if_block2.c();
      attr(div0, "class", "dn-view-loader");
      attr(div1, "class", "daily-note-view");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      if (if_block0)
        if_block0.m(div1, null);
      append(div1, t0);
      if (if_block1)
        if_block1.m(div1, null);
      append(div1, t1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div1, t2);
      append(div1, div0);
      ctx[23](div0);
      append(div1, t3);
      if (if_block2)
        if_block2.m(div1, null);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(inview_action = inview.call(null, div0, { root: (
            /*leaf*/
            ctx[1].view.containerEl
          ) })),
          listen(
            div0,
            "inview_init",
            /*startFillViewport*/
            ctx[9]
          ),
          listen(
            div0,
            "inview_change",
            /*infiniteHandler*/
            ctx[11]
          ),
          listen(
            div0,
            "inview_leave",
            /*stopFillViewport*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      var _a2;
      if (
        /*renderedFiles*/
        ctx2[6].length === 0
      ) {
        if (if_block0)
          ;
        else {
          if_block0 = create_if_block_2();
          if_block0.c();
          if_block0.m(div1, t0);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (dirty[0] & /*selectionMode, fileManager, selectedRange*/
      44)
        show_if = /*selectionMode*/
        ctx2[3] === "daily" && !/*fileManager*/
        ((_a2 = ctx2[5]) == null ? void 0 : _a2.hasCurrentDayNote()) && /*selectedRange*/
        (ctx2[2] === "all" || /*selectedRange*/
        ctx2[2] === "week" || /*selectedRange*/
        ctx2[2] === "month" || /*selectedRange*/
        ctx2[2] === "year" || /*selectedRange*/
        ctx2[2] === "quarter");
      if (show_if) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_1(ctx2);
          if_block1.c();
          if_block1.m(div1, t1);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (dirty[0] & /*leaf, handleNoteVisibilityChange, renderedFiles, plugin, visibleNotes*/
      8275) {
        each_value = ensure_array_like(
          /*renderedFiles*/
          ctx2[6]
        );
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block, t2, get_each_context);
        check_outros();
      }
      if (inview_action && is_function(inview_action.update) && dirty[0] & /*leaf*/
      2)
        inview_action.update.call(null, { root: (
          /*leaf*/
          ctx2[1].view.containerEl
        ) });
      if (!/*hasMore*/
      ctx2[7]) {
        if (if_block2)
          ;
        else {
          if_block2 = create_if_block();
          if_block2.c();
          if_block2.m(div1, null);
        }
      } else if (if_block2) {
        if_block2.d(1);
        if_block2 = null;
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      ctx[23](null);
      if (if_block2)
        if_block2.d();
      mounted = false;
      run_all$1(dispose);
    }
  };
}
const size = 1;
function instance($$self, $$props, $$invalidate) {
  let fileManagerOptions;
  let { plugin } = $$props;
  let { leaf } = $$props;
  let { selectedRange = "all" } = $$props;
  let { customRange = null } = $$props;
  let { selectionMode = "daily" } = $$props;
  let { target = "" } = $$props;
  let { timeField = "mtime" } = $$props;
  let intervalId;
  let renderedFiles = [];
  let filteredFiles = [];
  let visibleNotes = /* @__PURE__ */ new Set();
  let hasMore = true;
  let firstLoaded = true;
  let loaderRef;
  let fileManager;
  onMount(() => {
    $$invalidate(5, fileManager = new FileManager(fileManagerOptions));
    $$invalidate(21, filteredFiles = fileManager.getFilteredFiles());
    $$invalidate(7, hasMore = filteredFiles.length > 0);
    startFillViewport();
    updateTitleElement();
  });
  function updateTitleElement() {
    if (!leaf || !leaf.view || !leaf.view.titleEl)
      return;
    const titleEl = leaf.view.titleEl;
    titleEl.empty();
    let titleText = "";
    if (selectionMode === "daily" && selectedRange !== "all") {
      if (selectedRange === "custom" && customRange) {
        titleText = `Showing notes from: ${require$$0.moment(customRange.start).format("YYYY-MM-DD")} to ${require$$0.moment(customRange.end).format("YYYY-MM-DD")}`;
      } else {
        titleText = `Showing notes for: ${selectedRange}`;
      }
    } else if (selectionMode === "folder") {
      titleText = `Showing files from folder: ${target}`;
      if (selectedRange !== "all") {
        titleText += ` (${timeField === "ctime" ? "created" : "modified"} ${selectedRange})`;
      }
    } else if (selectionMode === "tag") {
      titleText = `Showing files with tag: ${target}`;
      if (selectedRange !== "all") {
        titleText += ` (${timeField === "ctime" ? "created" : "modified"} ${selectedRange})`;
      }
    }
    if (titleText) {
      titleEl.setText(titleText);
    } else {
      titleEl.setText("Daily Notes");
    }
  }
  function startFillViewport() {
    if (!intervalId) {
      intervalId = setInterval(infiniteHandler, 1);
    }
  }
  function stopFillViewport() {
    clearInterval(intervalId);
    intervalId = null;
  }
  function infiniteHandler() {
    if (leaf.height === 0)
      return;
    if (!fileManager || !hasMore)
      return;
    if (filteredFiles.length === 0) {
      $$invalidate(7, hasMore = false);
    } else {
      $$invalidate(6, renderedFiles = [...renderedFiles, ...filteredFiles.splice(0, size)]);
      if (firstLoaded) {
        window.setTimeout(
          () => {
            ensureViewFilled();
            firstLoaded = false;
          },
          100
        );
      }
    }
  }
  function ensureViewFilled() {
    if (!loaderRef)
      return;
    const loaderRect = loaderRef.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const contentHeight = leaf.view.contentEl.clientHeight || leaf.view.contentEl.innerHeight || viewportHeight;
    const effectiveHeight = Math.max(viewportHeight, contentHeight) + 200;
    if (loaderRect.top < effectiveHeight) {
      infiniteHandler();
      window.setTimeout(
        () => {
          if (hasMore && loaderRef && loaderRef.getBoundingClientRect().top < effectiveHeight) {
            ensureViewFilled();
          }
        },
        50
      );
    }
  }
  function createNewDailyNote() {
    return __awaiter(this, void 0, void 0, function* () {
      const newNote = yield fileManager.createNewDailyNote();
      if (newNote) {
        $$invalidate(6, renderedFiles = [newNote, ...renderedFiles]);
        visibleNotes.add(newNote.path);
        $$invalidate(4, visibleNotes);
      }
    });
  }
  function tick2() {
    check();
    $$invalidate(6, renderedFiles), $$invalidate(5, fileManager), $$invalidate(2, selectedRange), $$invalidate(14, customRange), $$invalidate(3, selectionMode), $$invalidate(15, target), $$invalidate(16, timeField), $$invalidate(4, visibleNotes), $$invalidate(21, filteredFiles);
  }
  function check() {
    const hadDailyNote = fileManager.hasCurrentDayNote();
    fileManager.checkDailyNote();
    const hasDailyNote = fileManager.hasCurrentDayNote();
    if (hadDailyNote !== hasDailyNote || selectionMode === "daily" && selectedRange !== "all") {
      $$invalidate(21, filteredFiles = fileManager.getFilteredFiles());
      if (selectionMode === "daily") {
        $$invalidate(6, renderedFiles = []);
        visibleNotes.clear();
        $$invalidate(7, hasMore = filteredFiles.length > 0);
        firstLoaded = true;
        startFillViewport();
      }
    }
  }
  function fileCreate(file) {
    fileManager.fileCreate(file);
    if (selectionMode === "daily") {
      const filteredFiles2 = fileManager.getFilteredFiles();
      if (filteredFiles2.some((f) => f.basename === file.basename) && !renderedFiles.some((f) => f.basename === file.basename)) {
        $$invalidate(6, renderedFiles = [file, ...renderedFiles]);
        visibleNotes.add(file.path);
        $$invalidate(4, visibleNotes);
      }
    } else {
      $$invalidate(6, renderedFiles = fileManager.getFilteredFiles().slice(0, renderedFiles.length));
    }
  }
  function fileDelete(file) {
    fileManager.fileDelete(file);
    $$invalidate(6, renderedFiles = renderedFiles.filter((dailyNote) => {
      return dailyNote.basename !== file.basename;
    }));
    if (visibleNotes.has(file.path)) {
      visibleNotes.delete(file.path);
      $$invalidate(4, visibleNotes);
    }
  }
  function handleNoteVisibilityChange(file, isVisible) {
    console.log("inview", isVisible);
    if (isVisible) {
      visibleNotes.add(file.path);
    } else {
      visibleNotes.delete(file.path);
    }
    $$invalidate(4, visibleNotes);
  }
  const inview_change_handler = (file, { detail }) => handleNoteVisibilityChange(file, detail.inView);
  function div0_binding($$value) {
    binding_callbacks$1[$$value ? "unshift" : "push"](() => {
      loaderRef = $$value;
      $$invalidate(8, loaderRef);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("plugin" in $$props2)
      $$invalidate(0, plugin = $$props2.plugin);
    if ("leaf" in $$props2)
      $$invalidate(1, leaf = $$props2.leaf);
    if ("selectedRange" in $$props2)
      $$invalidate(2, selectedRange = $$props2.selectedRange);
    if ("customRange" in $$props2)
      $$invalidate(14, customRange = $$props2.customRange);
    if ("selectionMode" in $$props2)
      $$invalidate(3, selectionMode = $$props2.selectionMode);
    if ("target" in $$props2)
      $$invalidate(15, target = $$props2.target);
    if ("timeField" in $$props2)
      $$invalidate(16, timeField = $$props2.timeField);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*selectionMode, target, selectedRange, customRange, plugin, timeField*/
    114701) {
      fileManagerOptions = {
        mode: selectionMode,
        target,
        timeRange: selectedRange,
        customRange,
        app: plugin.app,
        timeField
      };
    }
    if ($$self.$$.dirty[0] & /*fileManager, selectedRange, customRange, selectionMode, target, timeField, visibleNotes, filteredFiles*/
    2211900) {
      if (fileManager && (selectedRange !== fileManager.options.timeRange || customRange !== fileManager.options.customRange || selectionMode !== fileManager.options.mode || target !== fileManager.options.target || timeField !== fileManager.options.timeField)) {
        fileManager.updateOptions({
          timeRange: selectedRange,
          customRange,
          mode: selectionMode,
          target,
          timeField
        });
        $$invalidate(6, renderedFiles = []);
        visibleNotes.clear();
        $$invalidate(21, filteredFiles = fileManager.getFilteredFiles());
        $$invalidate(7, hasMore = filteredFiles.length > 0);
        firstLoaded = true;
        startFillViewport();
        updateTitleElement();
      }
    }
  };
  return [
    plugin,
    leaf,
    selectedRange,
    selectionMode,
    visibleNotes,
    fileManager,
    renderedFiles,
    hasMore,
    loaderRef,
    startFillViewport,
    stopFillViewport,
    infiniteHandler,
    createNewDailyNote,
    handleNoteVisibilityChange,
    customRange,
    target,
    timeField,
    tick2,
    check,
    fileCreate,
    fileDelete,
    filteredFiles,
    inview_change_handler,
    div0_binding
  ];
}
class DailyNoteEditorView extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance,
      create_fragment,
      safe_not_equal,
      {
        plugin: 0,
        leaf: 1,
        selectedRange: 2,
        customRange: 14,
        selectionMode: 3,
        target: 15,
        timeField: 16,
        tick: 17,
        check: 18,
        fileCreate: 19,
        fileDelete: 20
      },
      null,
      [-1, -1]
    );
  }
  get tick() {
    return this.$$.ctx[17];
  }
  get check() {
    return this.$$.ctx[18];
  }
  get fileCreate() {
    return this.$$.ctx[19];
  }
  get fileDelete() {
    return this.$$.ctx[20];
  }
}
const DAILY_NOTE_VIEW_TYPE = "daily-note-editor-view";
class DailyNoteView extends require$$0.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.selectedDaysRange = "all";
    this.selectionMode = "daily";
    this.target = "";
    this.timeField = "mtime";
    this.customRange = null;
    this.getMode = () => {
      return "source";
    };
    this.onFileCreate = (file) => {
      if (file instanceof require$$0.TFile)
        this.view.fileCreate(file);
    };
    this.onFileDelete = (file) => {
      if (file instanceof require$$0.TFile)
        this.view.fileDelete(file);
    };
    this.plugin = plugin;
    this.scope = new require$$0.Scope(plugin.app.scope);
  }
  getViewType() {
    return DAILY_NOTE_VIEW_TYPE;
  }
  getDisplayText() {
    if (this.selectionMode === "daily") {
      return "Daily Notes";
    } else if (this.selectionMode === "folder") {
      return `Folder: ${this.target}`;
    } else if (this.selectionMode === "tag") {
      return `Tag: ${this.target}`;
    }
    return "Notes";
  }
  getIcon() {
    if (this.selectionMode === "daily") {
      return "calendar";
    } else if (this.selectionMode === "folder") {
      return "folder";
    } else if (this.selectionMode === "tag") {
      return "tag";
    }
    return "document";
  }
  setSelectedRange(range) {
    this.selectedDaysRange = range;
    if (this.view) {
      if (range === "custom") {
        this.view.$set({
          selectedRange: range,
          customRange: this.customRange
        });
      } else {
        this.view.$set({ selectedRange: range });
      }
    }
  }
  setSelectionMode(mode, target = "") {
    this.selectionMode = mode;
    this.target = target;
    if (this.view) {
      this.view.$set({
        selectionMode: mode,
        target
      });
    }
  }
  saveCurrentSelectionAsPreset() {
    if (this.selectionMode !== "daily" && this.target) {
      const existingPresetIndex = this.plugin.settings.preset.findIndex(
        (p) => p.type === this.selectionMode && p.target === this.target
      );
      if (existingPresetIndex === -1) {
        this.plugin.settings.preset.push({
          type: this.selectionMode,
          target: this.target
        });
        this.plugin.saveSettings();
      }
    }
  }
  getState() {
    const state2 = super.getState();
    return {
      ...state2,
      selectionMode: this.selectionMode,
      target: this.target,
      timeField: this.timeField,
      selectedRange: this.selectedDaysRange,
      customRange: this.customRange
    };
  }
  async setState(state2, result) {
    await super.setState(state2, result);
    if (state2 && typeof state2 === "object" && !this.view) {
      const customState = state2;
      if (customState.selectionMode)
        this.selectionMode = customState.selectionMode;
      if (customState.target)
        this.target = customState.target;
      if (customState.timeField)
        this.timeField = customState.timeField;
      if (customState.selectedRange)
        this.selectedDaysRange = customState.selectedRange;
      if (customState.customRange)
        this.customRange = customState.customRange;
      this.view = new DailyNoteEditorView({
        target: this.contentEl,
        props: {
          plugin: this.plugin,
          leaf: this.leaf,
          selectedRange: this.selectedDaysRange,
          customRange: this.customRange,
          selectionMode: this.selectionMode,
          target: this.target,
          timeField: this.timeField
        }
      });
      this.app.workspace.onLayoutReady(this.view.tick.bind(this));
      this.registerInterval(
        window.setInterval(async () => {
          this.view.check();
        }, 1e3 * 60 * 60)
      );
    }
  }
  setTimeField(field) {
    this.timeField = field;
    if (this.view) {
      this.view.$set({ timeField: field });
    }
  }
  openDailyNoteEditor() {
    this.plugin.openDailyNoteEditor();
  }
  async onOpen() {
    this.scope.register(["Mod"], "f", (e) => {
    });
    this.addAction("clock", "Select time field", (e) => {
      const menu = new require$$0.Menu();
      const addTimeFieldOption = (title, field) => {
        menu.addItem((item) => {
          item.setTitle(title);
          item.setChecked(this.timeField === field);
          item.onClick(() => {
            this.setTimeField(field);
          });
        });
      };
      addTimeFieldOption("Creation Time", "ctime");
      addTimeFieldOption("Modification Time", "mtime");
      addTimeFieldOption("Creation Time (Reverse)", "ctimeReverse");
      addTimeFieldOption("Modification Time (Reverse)", "mtimeReverse");
      addTimeFieldOption("Name (A-Z)", "name");
      addTimeFieldOption("Name (Z-A)", "nameReverse");
      menu.showAtMouseEvent(e);
    });
    this.addAction("layers-2", "Select view mode", (e) => {
      const menu = new require$$0.Menu();
      const addModeOption = (title, mode) => {
        menu.addItem((item) => {
          item.setTitle(title);
          item.setChecked(
            this.selectionMode === mode && !this.target
          );
          item.onClick(() => {
            if (mode === "daily") {
              this.setSelectionMode(mode);
            } else {
              const modal = new SelectTargetModal(
                this.plugin.app,
                mode,
                (target) => {
                  this.setSelectionMode(mode, target);
                  this.saveCurrentSelectionAsPreset();
                }
              );
              modal.open();
            }
          });
        });
      };
      addModeOption("Daily Notes", "daily");
      addModeOption("Folder", "folder");
      addModeOption("Tag", "tag");
      if (this.plugin.settings.preset.length > 0) {
        menu.addSeparator();
        menu.addItem((item) => {
          item.setTitle("Saved Presets");
          item.setDisabled(true);
        });
        for (const preset of this.plugin.settings.preset) {
          const title = preset.type === "folder" ? `Folder: ${preset.target}` : `Tag: ${preset.target}`;
          menu.addItem((item) => {
            item.setTitle(title);
            item.setChecked(
              this.selectionMode === preset.type && this.target === preset.target
            );
            item.onClick(() => {
              this.setSelectionMode(preset.type, preset.target);
            });
          });
        }
      }
      menu.showAtMouseEvent(e);
    });
    this.addAction("calendar-range", "Select date range", (e) => {
      const menu = new require$$0.Menu();
      const addRangeOption = (title, range) => {
        menu.addItem((item) => {
          item.setTitle(title);
          item.setChecked(this.selectedDaysRange === range);
          item.onClick(() => {
            this.setSelectedRange(range);
          });
        });
      };
      addRangeOption("All Notes", "all");
      addRangeOption("This Week", "week");
      addRangeOption("This Month", "month");
      addRangeOption("This Year", "year");
      addRangeOption("Last Week", "last-week");
      addRangeOption("Last Month", "last-month");
      addRangeOption("Last Year", "last-year");
      addRangeOption("This Quarter", "quarter");
      addRangeOption("Last Quarter", "last-quarter");
      menu.addSeparator();
      menu.addItem((item) => {
        item.setTitle("Custom Date Range");
        item.setChecked(this.selectedDaysRange === "custom");
        item.onClick(() => {
          const modal = new CustomRangeModal(this.app, (range) => {
            this.customRange = range;
            this.setSelectedRange("custom");
          });
          modal.open();
        });
      });
      menu.showAtMouseEvent(e);
    });
    this.addAction("refresh", "Refresh", () => {
      if (this.view) {
        this.view.check();
        this.view.tick();
        this.view.$set({
          selectedRange: this.selectedDaysRange,
          customRange: this.customRange
        });
      }
    });
    this.app.vault.on("create", this.onFileCreate);
    this.app.vault.on("delete", this.onFileDelete);
  }
  onPaneMenu(menu, source) {
    if (source === "tab-header" || source === "more-options") {
      menu.addItem((item) => {
        item.setIcon(this.leaf.pinned ? "pin-off" : "pin");
        item.setTitle(this.leaf.pinned ? "Unpin" : "Pin");
        item.onClick(() => {
          this.leaf.togglePinned();
        });
      });
    }
  }
  /**
   * Refresh the view for a new day
   * This is called when the date changes (e.g., after midnight)
   */
  refreshForNewDay() {
    if (this.selectionMode === "daily") {
      if (this.view) {
        this.view.check();
        this.view.tick();
        this.view.$set({
          selectedRange: this.selectedDaysRange,
          customRange: this.customRange
        });
      }
    }
  }
}
class CustomRangeModal extends require$$0.Modal {
  constructor(app2, saveCallback) {
    super(app2);
    this.saveCallback = saveCallback;
    this.startDate = /* @__PURE__ */ new Date();
    this.endDate = /* @__PURE__ */ new Date();
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "Select Custom Date Range" });
    const startDateContainer = contentEl.createEl("div", {
      cls: "custom-range-date-container"
    });
    startDateContainer.createEl("span", { text: "Start Date: " });
    const startDatePicker = startDateContainer.createEl("input", {
      type: "date",
      value: this.formatDate(this.startDate)
    });
    startDatePicker.addEventListener("change", (e) => {
      this.startDate = new Date(e.target.value);
    });
    const endDateContainer = contentEl.createEl("div", {
      cls: "custom-range-date-container"
    });
    endDateContainer.createEl("span", { text: "End Date: " });
    const endDatePicker = endDateContainer.createEl("input", {
      type: "date",
      value: this.formatDate(this.endDate)
    });
    endDatePicker.addEventListener("change", (e) => {
      this.endDate = new Date(e.target.value);
    });
    const buttonContainer = contentEl.createEl("div", {
      cls: "custom-range-button-container"
    });
    new require$$0.ButtonComponent(buttonContainer).setButtonText("Cancel").onClick(() => {
      this.close();
    });
    new require$$0.ButtonComponent(buttonContainer).setButtonText("Confirm").setCta().onClick(() => {
      this.saveCallback({
        start: this.startDate,
        end: this.endDate
      });
      this.close();
    });
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  onClose() {
    this.contentEl.empty();
  }
}
class SelectTargetModal extends require$$0.Modal {
  constructor(app2, mode, saveCallback) {
    super(app2);
    this.mode = mode;
    this.saveCallback = saveCallback;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", {
      text: this.mode === "folder" ? "Select Folder" : "Select Tag"
    });
    const form = contentEl.createEl("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.save();
    });
    const targetSetting = form.createDiv();
    targetSetting.addClass("setting-item");
    const targetSettingInfo = targetSetting.createDiv();
    targetSettingInfo.addClass("setting-item-info");
    targetSettingInfo.createEl("div", {
      text: this.mode === "folder" ? "Folder Path" : "Tag Name",
      cls: "setting-item-name"
    });
    targetSettingInfo.createEl("div", {
      text: this.mode === "folder" ? "Enter the path to the folder (e.g., 'folder/subfolder')" : "Enter the tag name without the '#' (e.g., 'tag')",
      cls: "setting-item-description"
    });
    const targetSettingControl = targetSetting.createDiv();
    targetSettingControl.addClass("setting-item-control");
    this.targetInput = targetSettingControl.createEl("input", {
      type: "text",
      value: ""
    });
    this.targetInput.addClass("target-input");
    const footerEl = contentEl.createDiv();
    footerEl.addClass("modal-button-container");
    footerEl.createEl("button", {
      text: "Cancel",
      cls: "mod-warning",
      attr: {
        type: "button"
      }
    }).addEventListener("click", () => {
      this.close();
    });
    footerEl.createEl("button", {
      text: "Save",
      cls: "mod-cta",
      attr: {
        type: "submit"
      }
    }).addEventListener("click", (e) => {
      e.preventDefault();
      this.save();
    });
  }
  save() {
    const target = this.targetInput.value.trim();
    if (target) {
      this.saveCallback(target);
      this.close();
    }
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
class DailyNoteViewPlugin extends require$$0.Plugin {
  async onload() {
    this.addSettingTab(new DailyNoteSettingTab(this.app, this));
    await this.loadSettings();
    this.patchWorkspace();
    this.patchWorkspaceLeaf();
    addIconList();
    this.lastCheckedDay = require$$0.moment().format("YYYY-MM-DD");
    this.settings.useArrowUpOrDownToNavigate && this.registerEditorExtension([
      createUpDownNavigationExtension({
        app: this.app,
        plugin: this
      })
      // setActiveEditorExt({ app: this.app, plugin: this }),
    ]);
    this.registerView(
      DAILY_NOTE_VIEW_TYPE,
      (leaf) => this.view = new DailyNoteView(leaf, this)
    );
    this.addRibbonIcon(
      "calendar-range",
      "Open Daily Note Editor",
      (evt) => this.openDailyNoteEditor()
    );
    this.addCommand({
      id: "open-daily-note-editor",
      name: "Open Daily Note Editor",
      callback: () => this.openDailyNoteEditor()
    });
    this.initCssRules();
    if (this.settings.createAndOpenOnStartup) {
      this.app.workspace.onLayoutReady(async () => {
        await this.ensureTodaysDailyNoteExists();
        if (this.app.workspace.getLeavesOfType(DAILY_NOTE_VIEW_TYPE).length > 0)
          return;
        await this.openDailyNoteEditor();
      });
    }
    this.registerInterval(
      window.setInterval(this.checkDayChange.bind(this), 1e3 * 60 * 15)
    );
    this.app.workspace.on("file-menu", (menu, file, source, leaf) => {
      if (file instanceof require$$0.TFolder) {
        menu.addItem((item) => {
          item.setIcon("calendar-range");
          item.setTitle("Open daily notes for this folder");
          item.onClick(() => {
            this.openFolderView(file.path);
          });
        });
      }
    });
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(DAILY_NOTE_VIEW_TYPE);
    document.body.toggleClass("daily-notes-hide-frontmatter", false);
    document.body.toggleClass("daily-notes-hide-backlinks", false);
  }
  async openDailyNoteEditor() {
    const workspace = this.app.workspace;
    const leaf = workspace.getLeaf(true);
    await leaf.setViewState({ type: DAILY_NOTE_VIEW_TYPE });
    workspace.revealLeaf(leaf);
  }
  async openFolderView(folderPath, timeField = "mtime") {
    const workspace = this.app.workspace;
    const leaf = workspace.getLeaf(true);
    await leaf.setViewState({ type: DAILY_NOTE_VIEW_TYPE });
    const view2 = leaf.view;
    view2.setSelectionMode("folder", folderPath);
    view2.setTimeField(timeField);
    workspace.revealLeaf(leaf);
  }
  async openTagView(tagName, timeField = "mtime") {
    const workspace = this.app.workspace;
    const leaf = workspace.getLeaf(true);
    await leaf.setViewState({ type: DAILY_NOTE_VIEW_TYPE });
    const view2 = leaf.view;
    view2.setSelectionMode("tag", tagName);
    view2.setTimeField(timeField);
    workspace.revealLeaf(leaf);
  }
  async ensureTodaysDailyNoteExists() {
    try {
      const currentDate = require$$0.moment();
      const allDailyNotes = getAllDailyNotes_1();
      const currentDailyNote = getDailyNote_1(currentDate, allDailyNotes);
      if (!currentDailyNote) {
        await createDailyNote_1(currentDate);
      }
    } catch (error) {
      console.error("Failed to create daily note:", error);
    }
  }
  initCssRules() {
    document.body.toggleClass(
      "daily-notes-hide-frontmatter",
      this.settings.hideFrontmatter
    );
    document.body.toggleClass(
      "daily-notes-hide-backlinks",
      this.settings.hideBacklinks
    );
  }
  patchWorkspace() {
    let layoutChanging = false;
    const uninstaller = around(require$$0.Workspace.prototype, {
      getActiveViewOfType: (next) => function(t) {
        const result = next.call(this, t);
        if (!result) {
          if ((t == null ? void 0 : t.VIEW_TYPE) === "markdown") {
            const activeLeaf = this.activeLeaf;
            if ((activeLeaf == null ? void 0 : activeLeaf.view) instanceof DailyNoteView) {
              return activeLeaf.view.editMode;
            } else {
              return result;
            }
          }
        }
        return result;
      },
      changeLayout(old) {
        return async function(workspace) {
          layoutChanging = true;
          try {
            await old.call(this, workspace);
          } finally {
            layoutChanging = false;
          }
        };
      },
      iterateLeaves(old) {
        return function(arg1, arg2) {
          if (old.call(this, arg1, arg2))
            return true;
          const cb = typeof arg1 === "function" ? arg1 : arg2;
          const parent = typeof arg1 === "function" ? arg2 : arg1;
          if (!parent)
            return false;
          if (layoutChanging)
            return false;
          if (!require$$0.requireApiVersion("0.15.0")) {
            if (parent === this.app.workspace.rootSplit || require$$0.WorkspaceContainer && parent instanceof require$$0.WorkspaceContainer) {
              for (const popover of DailyNoteEditor.popoversForWindow(
                parent.win
              )) {
                if (old.call(this, cb, popover.rootSplit))
                  return true;
              }
            }
          }
          return false;
        };
      },
      setActiveLeaf: (next) => function(e, t) {
        if (e.parentLeaf) {
          e.parentLeaf.activeTime = 17e11;
          next.call(this, e.parentLeaf, t);
          if (e.view.editMode) {
            this.activeEditor = e.view;
            e.parentLeaf.view.editMode = e.view;
          }
          return;
        }
        return next.call(this, e, t);
      }
    });
    this.register(uninstaller);
  }
  // Used for patch workspaceleaf pinned behaviors
  patchWorkspaceLeaf() {
    this.register(
      around(require$$0.WorkspaceLeaf.prototype, {
        getRoot(old) {
          return function() {
            const top = old.call(this);
            return (top == null ? void 0 : top.getRoot) === this.getRoot ? top : top == null ? void 0 : top.getRoot();
          };
        },
        setPinned(old) {
          return function(pinned) {
            old.call(this, pinned);
            if (isDailyNoteLeaf(this) && !pinned)
              this.setPinned(true);
          };
        },
        openFile(old) {
          return function(file, openState) {
            if (isDailyNoteLeaf(this)) {
              setTimeout(
                around(require$$0.Workspace.prototype, {
                  recordMostRecentOpenedFile(old2) {
                    return function(_file) {
                      if (_file !== file) {
                        return old2.call(this, _file);
                      }
                    };
                  }
                }),
                1
              );
              const recentFiles = this.app.plugins.plugins["recent-files-obsidian"];
              if (recentFiles)
                setTimeout(
                  around(recentFiles, {
                    shouldAddFile(old2) {
                      return function(_file) {
                        return _file !== file && old2.call(this, _file);
                      };
                    }
                  }),
                  1
                );
            }
            return old.call(this, file, openState);
          };
        }
      })
    );
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  async checkDayChange() {
    const currentDay = require$$0.moment().format("YYYY-MM-DD");
    if (currentDay !== this.lastCheckedDay) {
      this.lastCheckedDay = currentDay;
      console.log("Day changed, updating daily notes view");
      await this.ensureTodaysDailyNoteExists();
      const dailyNoteLeaves = this.app.workspace.getLeavesOfType(DAILY_NOTE_VIEW_TYPE);
      if (dailyNoteLeaves.length > 0) {
        for (const leaf of dailyNoteLeaves) {
          const view2 = leaf.view;
          if (view2) {
            view2.refreshForNewDay();
          }
        }
      }
    }
  }
}
module.exports = DailyNoteViewPlugin;


/* nosourcemap */