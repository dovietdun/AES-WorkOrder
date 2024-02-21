(function () {
    'use strict';
    angular.module('VF.FBOmApp.UIType')
        .constant('VF.FBOmApp.UIType.UITypeScreen.constants', ScreenServiceConstants())
        .service('VF.FBOmApp.UIType.UITypeScreen.service', ScreenService)
        .run(ScreenServiceRun);

    function ScreenServiceConstants() {
        return {
            data: {
                //appName: 'FBOmApp',
                appName: 'FBOmApp', // The name of App: in case of extended app, it is the name of AppBase
                appPrefix: 'VF',
                // TODO: Customize the entityName with the name of the entity defined in the App you want to manage within the UI Module.
                //       Customize the command name with the name of the command defined in the App you want to manage within the UI Module
                entityName: 'TypeDef',
                createPublicName: null,
                updatePublicName: null,
                deletePublicName: null,
                cmdType: 'TypeDefCmd'
            }
        };
    }

    ScreenService.$inject = ['$q', '$state', 'common.base', 'VF.FBOmApp.UIType.UITypeScreen.constants', 'common.services.logger.service'];
    function ScreenService($q, $state, base, context, loggerService) {
        var self = this;
        var logger, backendService;

        activate();
        function activate() {
            logger = loggerService.getModuleLogger('VF.FBOmApp.UIType.UITypeScreen.service');
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
                'TypeCmd': {
                    'NId': data.NId,
                    'Name': data.Name
                }
            };
            return execCommand(context.data.cmdType, obj);
        }

        function updateEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will create
            var obj = {
                'CmdId': data.Id,
                'Action': 'UPDATE',
                'TypeCmd': {
                    'NId': data.NId,
                    'Name': data.Name
                }
            };
            return execCommand(context.data.cmdType, obj);
        }

        function deleteEntity(data) {
            // TODO: Customize the mapping between "UI entity" and the "DB entity" that will delete
            var obj = {
                'CmdId': data.Id,
                'Action': 'DELETE',
                'TypeCmd': {
                    'NId': data.NId,
                    "Name": data.Name
                }
            };
            return execCommand(context.data.cmdType, obj);
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

    ScreenServiceRun.$inject = ['VF.FBOmApp.UIType.UITypeScreen.constants', 'common.base'];
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
