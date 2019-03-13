"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ReactDOM = require("react-dom");
var React = require("react");
var htmlToSprite_1 = require("../../../utils/htmlToSprite");
var editorTools_1 = require("./editorTools");
exports.DISPLAY_TARGET_WIDTH = 0.2;
exports.DISPLAY_SCALE = 10000;
exports.MOC_OBJECT_RADIUS = 10;
exports.MOC_OBJECT_NEAR_MARGIN = 20;
var LeftCreationTool = /** @class */ (function (_super) {
    tslib_1.__extends(LeftCreationTool, _super);
    function LeftCreationTool(props) {
        var _this = _super.call(this, props) || this;
        _this.props = props;
        _this.onKeyUp = function (e) {
            if (e.data.has(_this.BUTTON_CONFIG.createButton)) {
                _this.node.position = _this.getTargetPosition();
                _this.props.diagramModel.graph.addNodes([_this.node]);
                _this.refreshState();
            }
        };
        _this.idCounter = 0;
        var rootHtml = document.createElement('DIV');
        rootHtml.style.position = 'fixed';
        rootHtml.style.top = 'calc(50vh - 50px)';
        rootHtml.style.left = 'calc(50vw - 50px)';
        var holder = document.createElement('DIV');
        holder.style.position = 'relative';
        holder.style.width = '100%';
        holder.style.height = '100%';
        var container = document.createElement('DIV');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.backgroundColor = 'black';
        holder.appendChild(container);
        rootHtml.appendChild(holder);
        document.body.appendChild(rootHtml);
        _this.container = container;
        _this.rootHtml = rootHtml;
        _this.refreshState();
        return _this;
    }
    LeftCreationTool.prototype.refreshState = function () {
        var _this = this;
        var idNumber = this.idCounter++;
        var node = {
            id: this.props.nodeIdPrefix + "-" + idNumber,
            data: {
                label: "New Node " + idNumber,
                types: ['l3graph-node'],
            },
            position: { x: 0, y: 0, z: 0 },
        };
        ReactDOM.render(React.createElement("div", null,
            React.createElement("h3", { style: { color: 'blue', fontSize: 24, whiteSpace: 'nowrap' } }, node.data.label)), this.container, function () { return _this.onRefreshDone(node); });
    };
    LeftCreationTool.prototype.onRefreshDone = function (node) {
        var _this = this;
        this.rootHtml.style.display = 'block';
        htmlToSprite_1.htmlToImage(this.container).then(function (img) {
            _this.node = node;
            _this.displayImage = img;
            _this.rootHtml.style.display = 'none';
            _this.render();
        });
    };
    return LeftCreationTool;
}(editorTools_1.LeftGamepadEditorTool));
exports.LeftCreationTool = LeftCreationTool;