(function () {
    'use strict';
    angular.module('VF.FBOmApp.UIOrder').config(AddScreenStateConfig);

    AddScreenController.$inject = ['VF.FBOmApp.UIOrder.UIOrderScreen.service', '$state', '$stateParams', 'common.base', '$filter', '$scope'];
    function AddScreenController(dataService, $state, $stateParams, common, $filter, $scope) {
        var self = this;
        var sidePanelManager, backendService, propertyGridHandler, orderType, onChangeEntityPicker;

        activate();
        function activate() {
            init();
            registerEvents();

            sidePanelManager.setTitle('Add');
            sidePanelManager.open('e');
        }

        async function init() {
            sidePanelManager = common.services.sidePanel.service;
            backendService = common.services.runtime.backendService;

            //Initialize Model Data
            self.currentItem = null;
            self.validInputs = false;
            //Expose Model Methods
            self.save = save;
            self.cancel = cancel;
            self.onChangeEntityPicker = onChangeEntityPicker;
            self.optionsPicker = [];


            await execGetAllOrderType();
            //execGetAllMaterial();
            await execGetAllStatus();

            self.currentItem.Status = self.status[0];
            console.log("================self.currentItem.Status", self.currentItem.Status);
        }


        async function execGetAllOrderType() {
            await dataService.execGetAllOrderType().then(function (data) {
                if ((data) && (data.succeeded)) {
                    self.orderType = data.value;
                    console.log("=========================orderType", self.orderType);
                }
                else {
                    self.orderType = [];
                }
            }, backendService.backendError);
        }
        function onChangeEntityPicker(selectValue, newvalue) {
            let options = `$select=Name&$filter=contains(Name, '${newvalue}')`;
            dataService.getAddtionData(options, 'MaterialDef').then(function (data) {
                console.log('on change entity picker: ', data)
                if (data && data.succeeded) {
                    self.optionsPicker = data.value;
                }
            }, backendService.backendError)

        }
        async function execGetAllStatus() {
            await dataService.execGetAllStatus().then(function (data) {
                if ((data) && (data.succeeded)) {
                    self.status = data.value;
                    console.log("=========================status", self.status);

                }
                else {
                    self.status = [];
                }
            }, backendService.backendError);
        }


        function registerEvents() {
            $scope.$on('sit-property-grid.validity-changed', onPropertyGridValidityChange);
        }

        function save() {
            dataService.create(self.currentItem).then(onSaveSuccess, backendService.backendError);
        }

        function cancel() {
            sidePanelManager.close();
            $state.go('^');
        }

        function onSaveSuccess(data) {
            sidePanelManager.close();
            $state.go('^', {}, { reload: true });
        }

        function onPropertyGridValidityChange(event, params) {
            self.validInputs = params.validity;
        }
    }

    AddScreenStateConfig.$inject = ['$stateProvider'];
    function AddScreenStateConfig($stateProvider) {
        var screenStateName = 'home.VF_FBOmApp_UIOrder_UIOrderScreen';
        var moduleFolder = 'VF.FBOmApp/modules/UIOrder';

        var state = {
            name: screenStateName + '.add',
            url: '/add',
            views: {
                'property-area-container@': {
                    templateUrl: moduleFolder + '/UIOrderScreen-add.html',
                    controller: AddScreenController,
                    controllerAs: 'vm'
                }
            },
            data: {
                title: 'Add'
            }
        };
        $stateProvider.state(state);
    }
}());
