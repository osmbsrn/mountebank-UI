 angular.module('myApp')

        .controller('SettingsCtrl', function ($scope, $log,TPL_PATH,ImpostersService,currentImposter) {
            var vm = this;
    
            vm.currentImposter = currentImposter;
            vm.mounteBankUrl = "http://localhost:4545";
            vm.headerLocation = TPL_PATH +"partials/plainHeader.tpl.html"
    
        });

