(function () {
    'use strict';
    angular.module('VF.FBOmApp.UIProcessStatus')
        .constant('VF.FBOmApp.UIProcessStatus.UIProcessStatusScreen.constants', ScreenServiceConstants())
        .service('VF.FBOmApp.UIProcessStatus.UIProcessStatusScreen.service', ScreenService)
        .run(ScreenServiceRun);

    function ScreenServiceConstants() {
        return {
            data: {
                //appName: 'FBOmApp',
                appName: 'FBOmApp', // The name of App: in case of extended app, it is the name of AppBase
                appPrefix: 'VF',
                // TODO: Customize the entityName with the name of the entity defined in the App you want to manage within the UI Module.
                //       Customize the command name with the name of the command defined in the App you want to manage within the UI Module
                entityName: 'ChangeStatus',
                createPublicName: null,
                updatePublicName: null,
                deletePublicName: null,
                cmdChange: 'ChangeStatusCmd'
            }
        };
    }

    ScreenService.$inject = ['$q', '$state', 'common.base', 'VF.FBOmApp.UIProcessStatus.UIProcessStatusScreen.constants', 'common.services.logger.service'];
    function ScreenService($q, $state, base, context, loggerService) {
        var self = this;
        var logger, backendService;

        activate();
        function activate() {
            logger = loggerService.getModuleLogger('VF.FBOmApp.UIProcessStatus.UIProcessStatusScreen.service');
            backendService = base.services.runtime.backendService;
            exposeApi();
        }

        function exposeApi() {
            self.getAll = getAll;
            self.create = createEntity;
            self.update = updateEntity;
            self.delete = deleteEntity;
        }

        function getAll(options) {
            return execGetAll(options);
        }

        function createEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create 
            var obj = {
                'CmdId': data.CmdId,
                'Action': 'ADD',
                'ChangeCmd': {
                    'NId': data.NId,
                    'OrderType': data.OrderType,
                    'FromStatus': data.FromStatus,
                    'ToStatus': data.ToStatus
                }
            };
            return execCommand(context.data.cmdChange, obj);
        }

        function updateEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create
            var obj = {
                'CmdId': data.Id,
                'Action': 'UPDATE',
                'ChangeCmd': {
                    'NId': data.NId,
                    'OrderType': data.OrderType,
                    'FromStatus': data.FromStatus,
                    'ToStatus': data.ToStatus
                }
            };
            return execCommand(context.data.cmdChange, obj);
        }

        function deleteEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will delete
            var obj = {
                'CmdId': data.Id,
                'Action': 'DELETE',
                'ChangeCmd': {
                    'NId': data.NId,
                    'OrderType': data.OrderType,
                    'FromStatus': data.FromStatus,
                    'ToStatus': data.ToStatus
                }
            };
            return execCommand(context.data.cmdChange, obj);
        }

        function execGetAll(options) {
            return backendService.findAll({
                'appName': context.data.appName,
                'entityName': context.data.entityName,
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

    ScreenServiceRun.$inject = ['VF.FBOmApp.UIProcessStatus.UIProcessStatusScreen.constants', 'common.base'];
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
