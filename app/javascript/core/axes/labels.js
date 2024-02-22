/**
 * Used to add custom labels to datasets when exporting
 */
var wpd = wpd || {};

wpd.AxesLabels = (function() {
    var labels = new Map();

    return {
        /**
         * Checks if there exists an entry for the given dataset name
         * @param {string} datasetName - Name of the dataset
         * @returns {boolean} whether for the dataset exists internally
         */
        containsDataset: function(datasetName) {    
            return labels.has(datasetName);
        },

        /**
         * Get label for a dataset
         * @param {string} datasetName - Name of the dataset
         * @returns {string} Label for the dataset
         */
        getLabel: function(datasetName) {
            return labels.get(datasetName);
        },

        /**
         * Update label for a dataset
         * @param {string} datasetName - Name of the dataset to update
         * @param {string} labels - Labels to update
         * @param {string} oldDatasetName - (Optional) Name of the dataset being replaced
         */
        updateLabel: function(newDatasetName, newLabels, oldDatasetName) {
            if (oldDatasetName) {
                labels.delete(oldDatasetName);
            }
            labels.set(newDatasetName, newLabels);
        }
    };
})();