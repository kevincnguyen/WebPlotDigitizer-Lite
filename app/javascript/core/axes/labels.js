/**
 * Used to add custom labels to datasets when exporting
 */
var wpd = wpd || {};

wpd.AxesLabels = (function() {
    var labels = new Map();

    return {
        /**
         * Checks if there exists an entry for the given axes name
         * @param {string} axesName - Name of the axes
         * @returns {boolean} whether for the axes exists internally
         */
        containsAxes: function(axesName) {    
            return labels.has(axesName);
        },

        /**
         * Get label for a axes
         * @param {string} axesName - Name of the axes
         * @returns {string} Label for the axes
         */
        getLabel: function(axesName) {
            return labels.get(axesName);
        },

        /**
         * Update label for a axes
         * @param {string} newAxesName - Name of the axes to update
         * @param {string} labels - Labels to update
         * @param {string} oldAxesName - (Optional) Name of the axes being replaced
         */
        updateLabel: function(newAxesName, newLabels, oldAxesName) {
            if (oldAxesName) {
                labels.delete(oldAxesName);
            }
            labels.set(newAxesName, newLabels);
        }
    };
})();