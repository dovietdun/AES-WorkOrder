(function () {
    'use strict';
    angular.module('VF.FBOmApp.UIOrder')
        .constant('VF.FBOmApp.UIOrder.UIOrderScreen.constants', ScreenServiceConstants())
        .service('VF.FBOmApp.UIOrder.UIOrderScreen.service', ScreenService)
        .run(ScreenServiceRun);

    function ScreenServiceConstants() {
        return {
            data: {
                //appName: 'FBOmApp',
                appName: 'FBOmApp', // The name of App: in case of extended app, it is the name of AppBase
                appPrefix: 'VF',
                // TODO: Customize the entityName with the name of the entity defined in the App you want to manage within the UI Module.
                //       Customize the command name with the name of the command defined in the App you want to manage within the UI Module
                entityName: 'OrderDef',
                createPublicName: null,
                updatePublicName: null,
                deletePublicName: null,
                cmdOrder: 'OrderDefCmd',
                entityOrderType: 'TypeDef',
                entityMaterial: 'MaterialDef',
                entityStatus: 'StatusDef',
                entitySplit: 'SplitOrder',
                cmdSplit: 'SplitCmd',
                cmdUploadFile: 'UploadCmd',
                execRFOrderDef: 'RFOrderDef',
                cmdListData: 'ListDataCmd'
            }
        };
    }

    ScreenService.$inject = ['$q', '$state', 'common.base', 'VF.FBOmApp.UIOrder.UIOrderScreen.constants', 'common.services.logger.service'];
    function ScreenService($q, $state, base, context, loggerService) {
        var self = this;
        var logger, backendService;

        activate();
        function activate() {
            logger = loggerService.getModuleLogger('VF.FBOmApp.UIOrder.UIOrderScreen.service');
            backendService = base.services.runtime.backendService;
            exposeApi();
        }

        function exposeApi() {
            self.getAll = getAll;
            self.create = createEntity;
            self.update = updateEntity;
            self.delete = deleteEntity;
            self.split = splitBatch;
            self.changeStatus = changeStatus;
            self.genBatch = genBatch;
            self.changeScrapp = changeScrapp;
            self.execGetAllOrderType = execGetAllOrderType;
            //self.execGetAllMaterial = execGetAllMaterial;
            self.execGetAllStatus = execGetAllStatus;
            self.onChangeEntityPicker = onChangeEntityPicker;
            self.getAddtionData = getAddtionData;
            self.upload = uploadFile;
            self.execRFOrderDef = execRFOrderDef;
        }

        function getAll(options) {
            return execGetAll(options);
        }

        function createEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create 
            //console.log('data', data);

            var obj = {
                'CmdId': data.CmdId,
                'Action': 'ADD',
                'OrderCmd': {
                    'NId': data.NId,
                    'Type': data.Type.NId,
                    'Status': data.Status.Name,
                    'MaterialFinal': data.Name.Name,
                    'PlanStartDate': data.PlanStartDate,
                    'PlanEndDate': data.PlanEndDate,
                    'ActualStartDate': data.ActualStartDate,
                    'ActualEndDate': data.ActualEndDate,
                    'Quantity': data.Quantity
                }
            };

            //console.log('obj', obj);
            //return;

            return execCommand(context.data.cmdOrder, obj);
            //Console.log("================add", obj);
        }

        function updateEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create
            var obj = {
                'CmdId': data.Id,
                'Action': 'UPDATE',
                'OrderCmd': {
                    'NId': data.NId,
                    'Type': data.Type.NId,
                    'Status': data.Status.Name,
                    'MaterialFinal': data.MaterialFinal,
                    'PlanStartDate': data.PlanStartDate,
                    'PlanEndDate': data.PlanEndDate,
                    'ActualStartDate': data.ActualStartDate,
                    'ActualEndDate': data.ActualEndDate,
                    'Quantity': data.Quantity
                }
            };
            return execCommand(context.data.cmdOrder, obj);
        }

        function deleteEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will delete
            var obj = {
                'CmdId': data.Id,
                'Action': 'DELETE',
                'OrderCmd': {
                    'NId': data.NId,
                    'Type': data.Type,
                    'Status': data.Status,
                    'MaterialFinal': data.MaterialFinal
                }
            };
            return execCommand(context.data.cmdOrder, obj);
        }

        //Split BatchOrder
        function splitBatch(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create
            var obj = {
                'CmdId': data.CmdId,
                'Action': 'SPLIT',
                'SplitCmd_': {
                    'NId': data.NId,
                    'ParrentId': data.NId,
                    'Type': data.Type,
                    'Status': data.Status,
                    'MaterialFinal': data.MaterialFinal,
                    'PlanStartDate': data.PlanStartDate,
                    'PlanEndDate': data.PlanEndDate,
                    'ActualStartDate': data.ActualStartDate,
                    'ActualEndDate': data.ActualEndDate,
                    'Quantity': data.Quantity,
                    'SerialNumber': data.SerialNumber

                }
            };
            return execCommand(context.data.cmdSplit, obj);
            //return backendService.invoke({
            //    'appName': context.data.appName,
            //    'commandName': 'SplitOrderCmd',
            //    'params': obj
            //});
        }

        function uploadFile(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create 

            var obj = {
                'Action': 'LOADDATABE',
                'Data': data

            };
            //console.log('obj', obj);
            //return;

            return execCommand(context.data.cmdUploadFile, obj);
            //Console.log("================add", obj);
        }
        //Change Status
        function changeStatus(data) {
            var selecteds = data.map(function (item) {
                return {
                    'Id': item.Id,
                    'NId': item.NId,
                    'Type': item.Type,
                    'Status': item.Status,
                    'MaterialFinal': item.MaterialFinal,
                    'PlanStartDate': item.PlanStartDate != '' ? item.PlanStartDate : null,
                    'PlanEndDate': item.PlanEndDate != '' ? item.PlanEndDate : null,
                    'ActualStartDate': item.ActualStartDate != '' ? item.ActualStartDate : null,
                    'ActualEndDate': item.ActualEndDate != '' ? item.ActualEndDate : null,
                    'Quantity': item.Quantity,
                    'SerialNumber': item.SerialNumber,
                    'ParrentId': item.ParrentId,
                    'BatchID': item.BatchID,
                };
            });
            var obj = {
                'Action': 'changeStatus',
                'Data': selecteds,
            };
            return execCommand(context.data.cmdListData, obj);
        };
        //scrapp
        function changeScrapp(data) {
            var selecteds = data.map(function (item) {
                return {
                    'Id': item.Id,
                    'NId': item.NId,
                    'Type': item.Type,
                    'Status': item.Status,
                    'MaterialFinal': item.MaterialFinal,
                    'PlanStartDate': item.PlanStartDate != '' ? item.PlanStartDate : null,
                    'PlanEndDate': item.PlanEndDate != '' ? item.PlanEndDate : null,
                    'ActualStartDate': item.ActualStartDate != '' ? item.ActualStartDate : null,
                    'ActualEndDate': item.ActualEndDate != '' ? item.ActualEndDate : null,
                    'Quantity': item.Quantity,
                    'SerialNumber': item.SerialNumber,
                    'ParrentId': item.ParrentId,
                    'BatchID': item.BatchID,
                };
            });
            var obj = {
                'Action': 'Scrapp',
                'Data': selecteds,
            };
            return execCommand(context.data.cmdListData, obj);
        };

        //generate BatchID
        function genBatch(data) {
            var selecteds = data.map(function (item) {
                return {
                    'Id': item.Id,
                    'NId': item.NId,
                    'Type': item.Type,
                    'Status': item.Status,
                    'MaterialFinal': item.MaterialFinal,
                    'PlanStartDate': item.PlanStartDate != '' ? item.PlanStartDate : null,
                    'PlanEndDate': item.PlanEndDate != '' ? item.PlanEndDate : null,
                    'ActualStartDate': item.ActualStartDate != '' ? item.ActualStartDate : null,
                    'ActualEndDate': item.ActualEndDate != '' ? item.ActualEndDate : null,
                    'Quantity': item.Quantity,
                    'SerialNumber': item.SerialNumber,
                    'ParrentId': item.ParrentId,
                    'BatchID': item.BatchID,
                };
            });

            var obj = {
                'Action': 'GEN_BATCH',
                'Data': selecteds,
            };
            return execCommand(context.data.cmdListData, obj);
        };


        function execGetAll(options) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': context.data.entityName,
                'options': options
            });
        }

        //get materialFinal data
        function getAddtionData(options, addEntityName) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': addEntityName,
                'options': options
            });
        }


        //implement reading function
        function execRFOrderDef(params) {
            // logger.logDebug('Executing command.......', publicName);
            return backendService.read({
                'appName': context.data.appName,
                'functionName': context.data.execRFOrderDef,
                'option': '',
                'params': params
            });
        }



        function onChangeEntityPicker(selectValue, newvalue) {
            let options = `$select=NId&$filter=contains(NId, '${newvalue}')`;
            dataService.getAll(options).then(function (data) {
                console.log('response: ', data)
                if (data && data.succeeded) {
                    self.optionsPicker = data.value;
                }
            }, backendService.backendError)

        }

        function execGetAllOrderType(options) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': context.data.entityOrderType,
                'options': options
            });
        }
        function execGetAllStatus(options) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': context.data.entityStatus,
                'options': options
            });
        }


        function execCommand(publicName, params) {
            logger.logDebug('Executing command.......', publicName);
            return backendService.invoke({
                'appName': context.data.appName,
                'commandName': publicName,
                'params': params
            });
        }
    }

    ScreenServiceRun.$inject = ['VF.FBOmApp.UIOrder.UIOrderScreen.constants', 'common.base'];
    function ScreenServiceRun(context, common) {
        if (!context.data.entityName) {
            common.services.logger.service.logWarning('Configure the entityName');
        };
        if (!context.data.createPublicName) {
            common.services.logger.service.logWarning('Configure the createPublicName');
        };
        if (!context.data.deletePublicName) {
            common.services.logger.service.logWarning('Configure the deletePublicName');
        };
        if (!context.data.updatePublicName) {
            common.services.logger.service.logWarning('Configure the updatePublicName');
        };
    }
}());
