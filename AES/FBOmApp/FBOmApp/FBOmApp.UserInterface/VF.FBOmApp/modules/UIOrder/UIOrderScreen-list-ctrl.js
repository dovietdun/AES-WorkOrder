(function () {
    'use strict';
    angular.module('VF.FBOmApp.UIOrder').config(ListScreenRouteConfig);

    ListScreenController.$inject = ['VF.FBOmApp.UIOrder.UIOrderScreen.service', '$state', '$stateParams', '$rootScope', '$scope', 'common.base', 'common.services.logger.service'];
    function ListScreenController(dataService, $state, $stateParams, $rootScope, $scope, base, loggerService) {
        var self = this;
        var logger, rootstate, messageservice, backendService;

        activate();

        // Initialization function
        function activate() {
            logger = loggerService.getModuleLogger('VF.FBOmApp.UIOrder.UIOrderScreen');

            init();
            initGridOptions();
            initGridData();
        }

        function init() {
            logger.logDebug('Initializing controller.......');

            rootstate = 'home.VF_FBOmApp_UIOrder_UIOrderScreen';
            messageservice = base.widgets.messageOverlay.service;
            backendService = base.services.runtime.backendService;

            //Initialize Model Data
            self.selectedItem = null;
            self.isButtonVisible = false;
            self.viewerOptions = {};
            self.viewerData = [];

            //Expose Model Methods
            self.addButtonHandler = addButtonHandler;
            self.editButtonHandler = editButtonHandler;
            self.selectButtonHandler = selectButtonHandler;
            self.deleteButtonHandler = deleteButtonHandler;
            self.splitButtonHandler = splitButtonHandler;
            self.changeStatus = changeStatus;
            self.genBatch = genBatch;
            self.changeScrapp = changeScrapp;
            self.uploadFile = uploadFile;
            self.exportFile = exportFile;
            self.selectedItems = [];
            self.isGenBatchButtonVisible = false;
            self.isChangeStatusButtonVisible = [];
            self.isChangeStatusButtonVisible = false;
            self.isScrappButtonVisible = [];
            self.isScrappButtonVisible = false;
            self.isSplitButtonVisible = [];
            self.isSplitButtonVisible = false;


        }

        function initGridOptions() {
            self.viewerOptions = {
                containerID: 'itemlist',
                selectionMode: 'multi',
                viewOptions: 'gl',

                // TODO: Put here the properties of the entity managed by the service
                quickSearchOptions: { enabled: true, field: 'Id' },
                sortInfo: {
                    field: 'Id',
                    direction: 'asc'
                },
                image: 'fa-cube',
                tileConfig: {
                    titleField: 'Id'
                },
                gridConfig: {
                    // TODO: Put here the properties of the entity managed by the service
                    columnDefs: [
                        { field: 'NId', displayName: 'OrderId' },
                        { field: 'Type', displayName: 'Type' },
                        { field: 'Status', displayName: 'Status' },
                        { field: 'MaterialFinal', displayName: 'MaterialFinal' },
                        { field: 'Quantity', displayName: 'Quantity' },
                        { field: 'PlanStartDate', displayName: 'PlanStartDate' },
                        { field: 'PlanEndDate', displayName: 'PlanEndDate' },
                        { field: 'ActualStartDate', displayName: 'ActualStartDate' },
                        { field: 'ActualEndDate', displayName: 'ActualEndDate' },
                        { field: 'SerialNumber', displayName: 'SerialNumber' },
                        { field: 'ParrentId', displayName: 'ParrentID' },
                        { field: 'BatchID', displayName: 'BatchID' }


                    ],
                    //showSelectionCheckbox: true,
                    //showRowHighlight: true,
                },
                onSelectionChangeCallback: onGridItemSelectionChanged
            }
        }

        function initGridData() {
            let obj = {
                Type: '',
                Status: '',
                BatchID: '',
                SerialNumber: '',
                ParentID: ''
            };

            dataService.execRFOrderDef(obj).then(function (data) {
                if ((data) && (data.succeeded)) {
                    console.log("=========================data", data);
                    self.viewerData = data.value[0].Results;
                } else {
                    self.viewerData = [];
                }
            }, backendService.backendError);

            // dataService.getAll().then(function (data) {
            //     if ((data) && (data.succeeded)) {
            //         self.viewerData = data.value;
            //     } else {
            //         self.viewerData = [];
            //     }
            // }, backendService.backendError);
        }

        function addButtonHandler(clickedCommand) {
            $state.go(rootstate + '.add');
        }
        //split
        function splitButtonHandler(clickedCommand) {
            var title = "Split";
            // TODO: Put here the properties of the entity managed by the service
            var text = "Do you want to Split '" + self.selectedItem.Type + " " + self.selectedItem.NId + "'?";

            backendService.confirm(text, function () {
                dataService.split(self.selectedItem).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);
        }

        // change scrapp
        function changeScrapp(clickedCommand) {

            var title = "Change";
            var text = "Do you want to Change Scrapp";
            backendService.confirm(text, function () {
                dataService.changeScrapp(self.selectedItems).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);

        }



        // change status
        function changeStatus(clickedCommand) {

            var title = "Change";
            var text = "Do you want to Change Status";
            backendService.confirm(text, function () {
                dataService.changeStatus(self.selectedItems).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);

        }

        // uploadFile
        function uploadFile(clickedCommand) {
            var dataCSV = atob(self.valueInputFile.contents)

            dataService.upload(dataCSV).then(function () {
                $state.go(rootstate, {}, { reload: true });
            }, backendService.backendError);
        }

        // exportXML
        function exportFile() {

            const header = Object.keys(self.viewerData[0]);
            const content = self.viewerData.map(item => Object.values(item));

            const data = [header, ...content];
            const csvContent = data.map(row => row.join(",")).join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv' });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);

            link.download = 'data.csv';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


        // generate BatchID
        function genBatch(clickedCommand) {
            var title = "Change";
            var text = "Do you want to create BatchId ";

            backendService.confirm(text, function () {
                dataService.genBatch(self.selectedItems).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);
        }
        function editButtonHandler(clickedCommand) {
            // TODO: Put here the properties of the entity managed by the service
            $state.go(rootstate + '.edit', { id: self.selectedItem.Id, selectedItem: self.selectedItem });
        }

        function selectButtonHandler(clickedCommand) {
            // TODO: Put here the properties of the entity managed by the service
            $state.go(rootstate + '.select', { id: self.selectedItem.Id, selectedItem: self.selectedItem });
        }

        function deleteButtonHandler(clickedCommand) {
            var title = "Delete";
            // TODO: Put here the properties of the entity managed by the service
            var text = "Do you want to delete '" + self.selectedItem.Id + "'?";

            backendService.confirm(text, function () {
                dataService.delete(self.selectedItem).then(function () {
                    $state.go(rootstate, {}, { reload: true });
                }, backendService.backendError);
            }, title);
        }

        function onGridItemSelectionChanged(items, item) {
            console.log("----------------", items);
            self.selectedItems = items;

            if (item && item.selected == true) {
                self.selectedItem = item;
                setButtonsVisibility(true);
            } else {
                self.selectedItem = null;
                setButtonsVisibility(false);
            }
            if (items) {
                //gen BatchButton Visible

                //get distint OrderType
                let unique_OrderType = [
                    ...new Set(items.map((element) => element.Type)),
                ];
                //get distint Status
                let unique_Status = [
                    ...new Set(items.map((element) => element.Status)),
                ];
                //get distint ParentId
                let unique_ParentId = [
                    ...new Set(items.map((element) => element.ParrentId)),
                ];
                //get distint MaterialFInal
                let unique_MaterialFinal = [
                    ...new Set(items.map((element) => element.MaterialFinal)),
                ];
                //get distint item not ParentId
                var existBatchID = items.find(x => x.ParrentId == null);
                //check Status
                var checkStatus = ["Initial", "Scrapp"].includes(unique_Status[0]);
                var checkType = ["BatchOrder"].includes(unique_OrderType[0]);


                //check Button Gen Batch Visible
                if (unique_OrderType.length == 1
                    && unique_Status.length == 1
                    && !checkStatus && !checkType
                    && unique_ParentId.length == 1
                    && (existBatchID == null
                        || (unique_MaterialFinal.length == 1 && existBatchID != null))) {
                    self.isGenBatchButtonVisible = true;
                }
                else {
                    self.isGenBatchButtonVisible = false;
                }

                // check change Status button visible

                var excreptionStatus = ['Completed', 'Scrapp'].includes(unique_Status[0]);
                if (unique_OrderType.length == 1 && unique_Status.length == 1
                    && !excreptionStatus && !checkType) {
                    self.isChangeStatusButtonVisible = true;
                }
                else {
                    self.isChangeStatusButtonVisible = false;
                }

                //check button Scrapp 
                var checkScrapp = ['Initial', 'Split'].includes(unique_Status[0]);
                if (unique_OrderType.length == 1 && unique_Status.length == 1
                    && !checkScrapp) {
                    self.isScrappButtonVisible = true;
                }
                else {
                    self.isScrappButtonVisible = false;
                }

                //check button Split
                var checkOrderType = ['BatchOrder'].includes(unique_OrderType[0]);
                var checkSplit = ['Initial'].includes(unique_Status[0]);
                if (checkSplit && checkOrderType) {
                    self.isSplitButtonVisible = true;
                }
                else {
                    self.isSplitButtonVisible = false;
                }
            }
        }

        // Internal function to make item-specific buttons visible
        function setButtonsVisibility(visible) {
            self.isButtonVisible = visible;
        }
    }
    ListScreenRouteConfig.$inject = ['$stateProvider'];
    function ListScreenRouteConfig($stateProvider) {
        var moduleStateName = 'home.VF_FBOmApp_UIOrder';
        var moduleStateUrl = 'VF_FBOmApp_UIOrder';
        var moduleFolder = 'VF.FBOmApp/modules/UIOrder';

        var state = {
            name: moduleStateName + '_UIOrderScreen',
            url: '/' + moduleStateUrl + '_UIOrderScreen',
            views: {
                'Canvas@': {
                    templateUrl: moduleFolder + '/UIOrderScreen-list.html',
                    controller: ListScreenController,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'UIOrderScreen'
            }
        };
        $stateProvider.state(state);
    }
}());

