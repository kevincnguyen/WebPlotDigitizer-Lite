/*
    WebPlotDigitizer - https://automeris.io/WebPlotDigitizer

    Copyright 2010-2022 Ankit Rohatgi <ankitrohatgi@hotmail.com>

    This file is part of WebPlotDigitizer.

    WebPlotDigitizer is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebPlotDigitizer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with WebPlotDigitizer.  If not, see <http://www.gnu.org/licenses/>.
*/

var wpd = wpd || {};

wpd.AxesCalibrator = class {
    constructor(calibration, isEditing) {
        this._calibration = calibration;
        this._isEditing = isEditing;
    }
};

wpd.XYAxesCalibrator = class extends wpd.AxesCalibrator {

    start() {
        wpd.popup.show('xyAxesInfo');
    }

    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }

    pickCorners() {
        wpd.popup.close('xyAxesInfo');
        let tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }

    getCornerValues() {
        wpd.popup.show('xyAlignment');
        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 4) {
                document.getElementById('xmin').value = prevCal.getPoint(0).dx;
                document.getElementById('xmax').value = prevCal.getPoint(1).dx;
                document.getElementById('ymin').value = prevCal.getPoint(2).dy;
                document.getElementById('ymax').value = prevCal.getPoint(3).dy;
                document.getElementById('xlog').checked = axes.isLogX();
                document.getElementById('ylog').checked = axes.isLogY();
            }
        }
    }

    align() {
        let xmin = document.getElementById('xmin').value;
        let xmax = document.getElementById('xmax').value;
        let ymin = document.getElementById('ymin').value;
        let ymax = document.getElementById('ymax').value;
        let xlog = document.getElementById('xlog').checked;
        let ylog = document.getElementById('ylog').checked;
        let noRotation = false;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.XYAxes();

        // validate log scale values
        if ((xlog && (parseFloat(xmin) == 0 || parseFloat(xmax) == 0)) ||
            (ylog && (parseFloat(ymin) == 0 || parseFloat(ymax) == 0))) {
            wpd.popup.close('xyAlignment');
            wpd.messagePopup.show(wpd.gettext('calibration-invalid-log-inputs'),
                wpd.gettext('calibration-enter-valid-log'),
                wpd.alignAxes.getCornerValues);
            return false;
        }

        this._calibration.setDataAt(0, xmin, ymin);
        this._calibration.setDataAt(1, xmax, ymin);
        this._calibration.setDataAt(2, xmin, ymin);
        this._calibration.setDataAt(3, xmax, ymax);
        if (!axes.calibrate(this._calibration, xlog, ylog, noRotation)) {
            wpd.popup.close('xyAlignment');
            wpd.messagePopup.show(wpd.gettext('calibration-invalid-inputs'),
                wpd.gettext('calibration-enter-valid'),
                wpd.alignAxes.getCornerValues);
            return false;
        }

        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.XYAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('xyAlignment');
        return true;
    }
};

wpd.BarAxesCalibrator = class extends wpd.AxesCalibrator {
    start() {
        wpd.popup.show('barAxesInfo');
    }
    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }
    pickCorners() {
        wpd.popup.close('barAxesInfo');
        let tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }
    getCornerValues() {
        wpd.popup.show('barAlignment');
        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 2) {
                document.getElementById('bar-axes-p1').value = prevCal.getPoint(0).dy;
                document.getElementById('bar-axes-p2').value = prevCal.getPoint(1).dy;
                document.getElementById('bar-axes-log-scale').checked = axes.isLog();
                document.getElementById('bar-axes-rotated').checked = axes.isRotated();
            }
        }
    }
    align() {
        let p1 = document.getElementById('bar-axes-p1').value;
        let p2 = document.getElementById('bar-axes-p2').value;
        let isLogScale = document.getElementById('bar-axes-log-scale').checked;
        let isRotated = document.getElementById('bar-axes-rotated').checked;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.BarAxes();

        this._calibration.setDataAt(0, 0, p1);
        this._calibration.setDataAt(1, 0, p2);
        if (!axes.calibrate(this._calibration, isLogScale, isRotated)) {
            wpd.popup.close('barAlignment');
            wpd.messagePopup.show(wpd.gettext('calibration-invalid-inputs'),
                wpd.gettext('calibration-enter-valid'),
                wpd.alignAxes.getCornerValues);
            return false;
        }
        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.BarAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('barAlignment');
        return true;
    }
};

wpd.PolarAxesCalibrator = class extends wpd.AxesCalibrator {

    start() {
        wpd.popup.show('polarAxesInfo');
    }
    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }
    pickCorners() {
        wpd.popup.close('polarAxesInfo');
        let tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }

    getCornerValues() {
        wpd.popup.show('polarAlignment');
        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 3) {
                document.getElementById('polar-r1').value = prevCal.getPoint(1).dx;
                document.getElementById('polar-theta1').value = prevCal.getPoint(1).dy;
                document.getElementById('polar-r2').value = prevCal.getPoint(2).dx;
                document.getElementById('polar-theta2').value = prevCal.getPoint(2).dy;
                document.getElementById('polar-degrees').checked = axes.isThetaDegrees();
                document.getElementById('polar-radians').checked = !axes.isThetaDegrees();
                document.getElementById('polar-clockwise').checked = axes.isThetaClockwise();
                document.getElementById('polar-log-scale').checked = axes.isRadialLog();
            }
        }
    }

    align() {
        let r1 = parseFloat(document.getElementById('polar-r1').value);
        let theta1 = parseFloat(document.getElementById('polar-theta1').value);
        let r2 = parseFloat(document.getElementById('polar-r2').value);
        let theta2 = parseFloat(document.getElementById('polar-theta2').value);
        let degrees = document.getElementById('polar-degrees').checked;
        let orientation = document.getElementById('polar-clockwise').checked;
        let rlog = document.getElementById('polar-log-scale').checked;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.PolarAxes();
        let isDegrees = degrees;

        this._calibration.setDataAt(1, r1, theta1);
        this._calibration.setDataAt(2, r2, theta2);
        axes.calibrate(this._calibration, isDegrees, orientation, rlog);
        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.PolarAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('polarAlignment');
        return true;
    }
};

wpd.TernaryAxesCalibrator = class extends wpd.AxesCalibrator {

    start() {
        wpd.popup.show('ternaryAxesInfo');
    }

    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }

    pickCorners() {
        wpd.popup.close('ternaryAxesInfo');
        let tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }

    getCornerValues() {
        wpd.popup.show('ternaryAlignment');

        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 3) {
                document.getElementById('range0to1').checked = !axes.isRange100();
                document.getElementById('range0to100').checked = axes.isRange100();
                document.getElementById('ternarynormal').checked = axes.isNormalOrientation();
            }
        }
    }

    align() {
        let range100 = document.getElementById('range0to100').checked;
        let ternaryNormal = document.getElementById('ternarynormal').checked;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.TernaryAxes();

        axes.calibrate(this._calibration, range100, ternaryNormal);
        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.TernaryAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('ternaryAlignment');
        return true;
    }
};

wpd.MapAxesCalibrator = class extends wpd.AxesCalibrator {

    start() {
        wpd.popup.show('mapAxesInfo');
    }
    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }
    pickCorners() {
        wpd.popup.close('mapAxesInfo');
        var tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }
    getCornerValues() {
        wpd.popup.show('mapAlignment');
        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 2) {
                document.getElementById('scaleLength').checked = axes.getScaleLength();
                document.getElementById('scaleUnits').checked = axes.getUnits();
            }
        }
    }
    align() {
        let scaleLength = parseFloat(document.getElementById('scaleLength').value);
        let scaleUnits = document.getElementById('scaleUnits').value;
        let isOriginLocationBottomLeft = document.getElementById('map-origin-bottom-left').checked;
        let originLocation = isOriginLocationBottomLeft ? "bottom-left" : "top-left";
        let imageHeight = wpd.graphicsWidget.getImageSize().height;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.MapAxes();

        axes.calibrate(this._calibration, scaleLength, scaleUnits, originLocation, imageHeight);
        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.MapAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('mapAlignment');
        return true;
    }
};

wpd.CircularChartRecorderCalibrator = class extends wpd.AxesCalibrator {

    start() {
        wpd.popup.show('circularChartRecorderAxesInfo');
    }
    reload() {
        let tool = new wpd.AxesCornersTool(this._calibration, true);
        wpd.graphicsWidget.setTool(tool);
    }
    pickCorners() {
        wpd.popup.close('circularChartRecorderAxesInfo');
        let tool = new wpd.AxesCornersTool(this._calibration, false);
        wpd.graphicsWidget.setTool(tool);
    }

    getCornerValues() {
        wpd.popup.show('circularChartRecorderAlignment');
        if (this._isEditing) {
            let axes = wpd.tree.getActiveAxes();
            let prevCal = axes.calibration;
            if (prevCal.getCount() == 5) {
                document.getElementById('circular-t0').value = prevCal.getPoint(0).dx;
                document.getElementById('circular-r0').value = prevCal.getPoint(0).dy;
                let startTime = axes.getStartTime();
                if (startTime != null) {
                    document.getElementById('circular-tstart').value = startTime;
                }
                document.getElementById('circular-r2').value = prevCal.getPoint(2).dy;
            }
        }
    }

    align() {
        let t0 = document.getElementById('circular-t0').value;
        let r0 = parseFloat(document.getElementById('circular-r0').value);
        let r2 = parseFloat(document.getElementById('circular-r2').value);
        let tstart = document.getElementById('circular-tstart').value;
        let axes = this._isEditing ? wpd.tree.getActiveAxes() : new wpd.CircularChartRecorderAxes();

        this._calibration.setDataAt(0, t0, r0);
        this._calibration.setDataAt(1, t0, 0);
        this._calibration.setDataAt(2, t0, r2);
        this._calibration.setDataAt(3, 0, r2);
        this._calibration.setDataAt(4, 0, r2);

        axes.calibrate(this._calibration, tstart);
        if (!this._isEditing) {
            axes.name = wpd.alignAxes.makeAxesName(wpd.CircularChartRecorderAxes);
            let plot = wpd.appData.getPlotData();
            plot.addAxes(axes, wpd.appData.isMultipage());
            wpd.alignAxes.postProcessAxesAdd(axes);
        }
        wpd.popup.close('circularChartRecorderAlignment');
        return true;
    }
};

wpd.alignAxes = (function() {
    let calibration = null;
    let calibrator = null;

    function initiatePlotAlignment() {
        calibration = new wpd.Calibration(2);
        calibration.labels = ['X1', 'X2', 'Y1', 'Y2'];
        calibration.labelPositions = ['N', 'N', 'E', 'E'];
        calibration.maxPointCount = 4;
        calibrator = new wpd.XYAxesCalibrator(calibration);

        if (calibrator != null) {
            calibrator.start();
            wpd.graphicsWidget.setRepainter(new wpd.AlignmentCornersRepainter(calibration));
        }
    }

    function calibrationCompleted() {
        wpd.alignAxes.getCornerValues();
    }

    function zoomCalPoint(i) {
        var point = calibration.getPoint(i);
        wpd.graphicsWidget.updateZoomToImagePosn(point.px, point.py);
    }

    function getCornerValues() {
        calibrator.getCornerValues();
    }

    function pickCorners() {
        calibrator.pickCorners();
    }

    function align() {
        wpd.graphicsWidget.removeTool();
        wpd.graphicsWidget.removeRepainter();
        wpd.graphicsWidget.resetData();
        if (!calibrator.align()) {
            return;
        }
        wpd.sidebar.clear();
        wpd.tree.refresh();
        let dsNameColl = wpd.appData.getPlotData().getDatasetNames();
        if (dsNameColl.length > 0) {
            let dsName = dsNameColl[0];
            wpd.tree.selectPath("/" + wpd.gettext("datasets") + "/" + dsName);
        }
    }

    function editAlignment() {
        let hasAlignment = wpd.appData.isAligned() && calibrator != null;
        if (hasAlignment) {
            wpd.popup.show('edit-or-reset-calibration-popup');
        } else {
            wpd.popup.show('axesList');
        }
    }

    function addCalibration() {
        wpd.popup.show("axesList");
    }

    function reloadCalibrationForEditing() {
        wpd.popup.close('edit-or-reset-calibration-popup');
        calibrator = null;
        const axes = wpd.tree.getActiveAxes();

        console.log(axes);

        calibration = axes.calibration;
        calibrator = new wpd.XYAxesCalibrator(calibration, true);
        if (calibrator == null)
            return;
        calibrator.reload();
        if (axes instanceof wpd.CircularChartRecorderAxes) {
            wpd.graphicsWidget.setRepainter(new wpd.CircularChartRecorderAlignmentRepainter(calibration));
        } else {
            wpd.graphicsWidget.setRepainter(new wpd.AlignmentCornersRepainter(calibration));
        }
        wpd.graphicsWidget.forceHandlerRepaint();
        wpd.sidebar.show('axes-calibration-sidebar');
    }

    function deleteCalibration() {
        wpd.okCancelPopup.show(wpd.gettext("delete-axes"), wpd.gettext("delete-axes-text"), deleteAssociatedDatasets);
    }

    function deleteAssociatedDatasets() {
        const deleteAxes = () => {
            const plotData = wpd.appData.getPlotData();
            const axes = wpd.tree.getActiveAxes();
            plotData.deleteAxes(axes);
            if (wpd.appData.isMultipage()) {
                wpd.appData.getPageManager().deleteAxesFromCurrentPage([axes]);
            }
            wpd.tree.refresh();
            wpd.tree.selectPath("/" + wpd.gettext("advanced") + "/" + wpd.gettext("axes"));
            // dispatch axes delete event
            wpd.events.dispatch("wpd.axes.delete", {
                axes: axes
            });
        };

        const plotData = wpd.appData.getPlotData();
        const axes = wpd.tree.getActiveAxes();

        // get all datasets and filter to datasets of active axes
        const datasets = plotData.getDatasets();
        const axesDatasets = datasets.filter((ds) => plotData.getAxesForDataset(ds) === axes);

        if (axesDatasets.length > 0) {
            // only display delete associated datasets popup if they exist
            wpd.okCancelPopup.show(
                wpd.gettext("delete-associated-datasets"),
                wpd.gettext("delete-associated-datasets-text"),
                () => {
                    for (const dataset of axesDatasets) {
                        plotData.deleteDataset(dataset);
                        wpd.appData.getFileManager().deleteDatasetsFromCurrentFile([dataset]);
                        if (wpd.appData.isMultipage()) {
                            wpd.appData.getPageManager().deleteDatasetsFromCurrentPage([dataset]);
                        }
                        // dispatch dataset delete event
                        wpd.events.dispatch("wpd.dataset.delete", {
                            dataset: dataset
                        });

                        // no need to refresh the tree here
                    }

                    deleteAxes();
                },
                deleteAxes,
            );
        } else {
            // otherwise, proceed to delete the axes
            deleteAxes();
        }
    }

    function showRenameAxes() {
        const axes = wpd.tree.getActiveAxes();
        const $axName = document.getElementById("rename-axes-name-input");
        $axName.value = axes.name;
        wpd.popup.show('rename-axes-popup');
    }

    function renameAxes() {
        const $axName = document.getElementById("rename-axes-name-input");
        wpd.popup.close('rename-axes-popup');
        // check if this name already exists
        const name = $axName.value.trim();
        const plotData = wpd.appData.getPlotData();
        if (plotData.getAxesNames().indexOf(name) >= 0 || name.length === 0) {
            wpd.messagePopup.show(wpd.gettext("rename-axes-error"),
                wpd.gettext("axes-exists-error"), showRenameAxes);
            return;
        }
        const axes = wpd.tree.getActiveAxes();

        // Update label map
        const oldLabels = wpd.AxesLabels.getLabel(axes.name);
        wpd.AxesLabels.updateLabel(name, oldLabels, axes.name);

        axes.name = name;
        wpd.tree.refresh();
        wpd.tree.selectPath("/" + wpd.gettext("advanced") + "/" + wpd.gettext("axes") + "/" + name, true);
    }

    function renameKeypress(e) {
        if (e.key === "Enter") {
            renameAxes();
        }
    }

    function makeAxesName(axType) {
        const plotData = wpd.appData.getPlotData();
        let name = "";
        const existingAxesNames = plotData.getAxesNames();
        if (axType === wpd.XYAxes) {
            name = wpd.gettext("axes-name-xy");
        } else if (axType === wpd.PolarAxes) {
            name = wpd.gettext("axes-name-polar");
        } else if (axType === wpd.MapAxes) {
            name = wpd.gettext("axes-name-map");
        } else if (axType === wpd.TernaryAxes) {
            name = wpd.gettext("axes-name-ternary");
        } else if (axType === wpd.BarAxes) {
            name = wpd.gettext("axes-name-bar");
        } else if (axType === wpd.ImageAxes) {
            name = wpd.gettext("axes-name-image");
        } else if (axType === wpd.CircularChartRecorderAxes) {
            name = wpd.gettext("axes-name-circular-chart-recorder");
        }
        // avoid conflict with an existing name
        let idx = 2;
        let fullName = name;
        while (existingAxesNames.indexOf(fullName) >= 0) {
            fullName = name + " " + idx;
            idx++;
        }
        return fullName;
    }

    function postProcessAxesAdd(axes) {
        // dispatch axes add event
        wpd.events.dispatch("wpd.axes.add", {
            axes: axes
        });

        const plotData = wpd.appData.getPlotData();
        const fileManager = wpd.appData.getFileManager();
        const pageManager = wpd.appData.getPageManager();

        fileManager.addAxesToCurrentFile([axes]);

        let axesColl = fileManager.filterToCurrentFileAxes(plotData.getAxesColl());
        let datasetColl = fileManager.filterToCurrentFileDatasets(plotData.getDatasets());

        if (wpd.appData.isMultipage()) {
            pageManager.addAxesToCurrentPage([axes]);
            axesColl = pageManager.filterToCurrentPageAxes(axesColl);
            datasetColl = pageManager.filterToCurrentPageDatasets(datasetColl);
        }

        // create a default dataset and associate it with the axes if this is the first
        // axes (in the file and/or page) and datasets do not yet exist
        if (axesColl.length === 1 && datasetColl.length === 0) {
            let dataset = new wpd.Dataset();
            dataset.name = 'Default Dataset';
            const count = wpd.dataSeriesManagement.getDatasetWithNameCount(dataset.name);
            if (count > 0) dataset.name += ' ' + (count + 1);

            plotData.addDataset(dataset);
            fileManager.addDatasetsToCurrentFile([dataset]);

            if (wpd.appData.isMultipage()) {
                pageManager.addDatasetsToCurrentPage([dataset]);
            }

            // dispatch dataset add event
            wpd.events.dispatch("wpd.dataset.add", {
                dataset: dataset
            });
        }
    }

    return {
        start: initiatePlotAlignment,
        calibrationCompleted: calibrationCompleted,
        zoomCalPoint: zoomCalPoint,
        getCornerValues: getCornerValues,
        pickCorners: pickCorners,
        align: align,
        editAlignment: editAlignment,
        reloadCalibrationForEditing: reloadCalibrationForEditing,
        addCalibration: addCalibration,
        deleteCalibration: deleteCalibration,
        showRenameAxes: showRenameAxes,
        makeAxesName: makeAxesName,
        renameAxes: renameAxes,
        renameKeypress: renameKeypress,
        postProcessAxesAdd: postProcessAxesAdd
    };
})();