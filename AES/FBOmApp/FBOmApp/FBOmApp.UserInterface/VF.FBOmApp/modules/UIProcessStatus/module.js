(function(){
    'use strict';

    angular.module('VF.FBOmApp.UIProcessStatus', []).config(StateConfig);

    StateConfig.$inject = ['$stateProvider'];
    function StateConfig($stateProvider) {
        var moduleStateName = 'home.VF_FBOmApp_UIProcessStatus';
        var moduleStateUrl = 'VF_FBOmApp_UIProcessStatus';
        var moduleFolder = 'VF.FBOmApp/modules/UIProcessStatus';

        //Add new states under the root state to be unique. Below is an example code for reference
        //var state1 = {
        //    name: moduleStateName + '_state_name',
        //    url: '/' + moduleStateUrl + '_state_url',
        //    views: {
        //        'Canvas@': {
        //            templateUrl: moduleFolder + '/state_template.html',
        //            controller: 'state_controller',
        //            controllerAs: 'vm'
        //        }
        //    },
        //    data: {
        //        title: 'state_title'
        //    },
        //    params: {}
        //};
        //$stateProvider.state(state1);
    }
}());
