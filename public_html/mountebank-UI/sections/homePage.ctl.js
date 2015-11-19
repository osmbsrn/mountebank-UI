

angular.module('myApp')

        .controller('HomeCtrl', function ($scope, $log, ImpostersService) {
            var vm = this;
            vm.errorMessage = "No errors";
            vm.data = ImpostersService.getData("1");
            vm.currentIndex = 0;
            vm.mounteBankUrl = "http://localhost:4545"
            vm.currentImposter = null;
            vm.responseBuffer = {};
            vm.criteriaBuffer = {};
            vm.criteriaBuffer.matchTypes = ['matches', 'equals', 'regex', 'startsWith', 'contains', 'endsWith']
            vm.responseBuffer.headerCount = [];
            vm.criteriaBuffer.headerCount = [];
            var MAX_RESPONSE_HEADERS = 5;
            for (var i = 0; i < MAX_RESPONSE_HEADERS; i++)
            {
                vm.responseBuffer.headerCount.push(i + 1);
                vm.criteriaBuffer.headerCount.push(i + 1);
            }

            //change which imposter you are on
            vm.changeImposter = function (idx)
            {
                // $log.debug(idx);
                vm.currentIndex = idx;
                vm.currentImposter = vm.data.imposters[vm.currentIndex];
                scatter();
            }

            /**
             * fired when user changes the type of match criteria,
             * eg, regex, equals, startswith ......
             * @param {type} item
             * @param {type} event
             * @returns {undefined}
             */
            vm.matchTypeChange = function (newData)
            {
                
                $log.debug("stored->"+vm.currentImposter
                        .match.body_match.type+" new->"+newData);
                
                if (vm.currentImposter.match.body_match.type === newData)
                {
                    return;
                }
                // zero out the structures
                
                
                /*
                  
                vm.criteriaBuffer.bodyMatchType = vm.currentImposter.match.body_match.type;
                vm.criteriaBuffer.body = {};
                vm.criteriaBuffer.matchContent = "";
                
                if (vm.isEqualRequest(vm.criteriaBuffer.bodyMatchType))
                {
                    vm.criteriaBuffer.body = angular.toJson(vm.currentImposter.match.body_match.body, true);
                }
                else
                {
                    vm.criteriaBuffer.matchContent = vm.currentImposter.match.body_match.match_content;
                }
                  
                  
                  
                  
                match -->
                "body_match":
                    {
                        "type": "regex",
                        "matchContent": "*search1*"
                    }

                "body_match":
                    {
                        "type": "equals",
                        "body": {
                            "search": "ice"
                        }
                    }
                
                
                */
               // vm.criteriaBuffer.bodyMatchType = vm.currentImposter.match.body_match.type;
               // $log.debug(" xxx "+vm.criteriaBuffer.bodyMatchType);

            }
            
            /**
             * central routine for determining if match request is using 
             * equals, as opposed to regex, startswith ....
             * @param {type} item
             * @returns {Boolean}
             */
            vm.isEqualRequest = function(item)
            {
                if (item === 'equals')
                {
                    return true;
                }
                return false;
            }
            //initial call
            vm.changeImposter(vm.currentIndex);

            /**
             * method for onblur event of form input items
             * @param {type} item
             * @param {type} event
             * @returns {undefined}
             */
            vm.inputChange = function (item, event)
            {
                //console.log(angular.toJson(item))
            }

            /**
             * called when tabs are changed
             * @param {type} x
             * @returns {undefined}
             */
            vm.tabSelect = function (x)
            {
                $log.debug("tab " + x);
                gather();
                vm.displayData = angular.toJson(vm.data, true);
            }


            vm.displayData = angular.toJson(vm.data, true);

//            $scope.$watch(
//                    function watchDisplayData(scope) {
//                        // Return the "result" of the watch expression.
//                        return(vm.data);
//                    },
//                    function handleDisplayChange(newValueStr, oldValueStr) {
//                        try
//                        {
//                            vm.displayData = angular.toJson(newValueStr,true);
//                             $log.debug("called change ")
//                            vm.errorMessage =  "No errors";
//                        }
//                        catch (err)
//                        {
//                            vm.errorMessage = err.message;
//                        }
//                    }
//            );

///////////////////////////////////////////////////////////////////////////////
            /**
             * move current imposter data to buffer
             * @returns {undefined}
             */
            function scatter()
            {
                scatterResponse();
                scatterCriteria();
            }
            /**
             * move buffer back to data
             * @returns {undefined}
             */
            function gather()
            {
                gatherResponse();


            }


            /**
             * gather for the response section
             * @returns {undefined}
             */
            function gatherResponse()
            {
                vm.currentImposter.response.status = vm.responseBuffer.status;
                var hitCounter = 0;
                delete vm.currentImposter.response.headers;
                vm.currentImposter.response.headers = {};
                angular.forEach(vm.responseBuffer.headers, function (data, idx)
                {
                    if (typeof data.key !== 'undefined' && data.key.trim() !== "")
                    {
                        vm.currentImposter.response.headers[data.key] = data.value;
                    }
                });
                vm.currentImposter.response.body =
                        angular.fromJson(vm.responseBuffer.body);

            }


            /**
             * scatter for the response section
             * @returns {undefined}
             */
            function scatterResponse()
            {
                vm.responseBuffer.status = vm.currentImposter.response.status;
                vm.responseBuffer.headers = [];
                var headerPropCt = 0;
                for (var propertyName in vm.currentImposter.response.headers) {
                    var item = {};
                    item.value
                            = vm.currentImposter.response.headers[propertyName];
                    item.key
                            = propertyName;
                    vm.responseBuffer.headers.push(item);
                    headerPropCt++;
                    // keys.push(propertyName);
                    // values.push(person[propertyName]);
                }
                for (var k = headerPropCt; k < MAX_RESPONSE_HEADERS; k++)
                {
                    var item = {};
                    item.value = "";
                    item.key = "";
                    vm.responseBuffer.headers.push(item);
                }

                //body
                vm.responseBuffer.body = angular.toJson(vm.currentImposter.response.body, true);

            }
            /**
             * scatter for the criteria section
             * @returns {undefined}
             */
            function scatterCriteria()
            {
                vm.criteriaBuffer.path = vm.currentImposter.match.path;
                vm.criteriaBuffer.verb = vm.currentImposter.match.verb;
                vm.criteriaBuffer.headers = [];
                var headerPropCt = 0;
                for (var propertyName in vm.currentImposter.match.headers) {
                    var item = {};
                    item.value
                            = vm.currentImposter.match.headers[propertyName];
                    item.key
                            = propertyName;
                    vm.criteriaBuffer.headers.push(item);
                    headerPropCt++;
                    // keys.push(propertyName);
                    // values.push(person[propertyName]);
                }
                for (var k = headerPropCt; k < MAX_RESPONSE_HEADERS; k++)
                {
                    var item = {};
                    item.value = "";
                    item.key = "";
                    vm.criteriaBuffer.headers.push(item);
                }
                vm.criteriaBuffer.bodyMatch = vm.currentImposter.match.body_match;
                  
                if (vm.isEqualRequest(vm.criteriaBuffer.bodyMatch.type))
                {
                    vm.criteriaBuffer.bodyMatch.body = angular.toJson(vm.currentImposter.match.body_match.body, true);
                    vm.criteriaBuffer.bodyMatch.matchContent ="";
                }
                else
                {
                    vm.criteriaBuffer.bodyMatch.matchContent = vm.currentImposter.match.body_match.matchContent;
                    vm.criteriaBuffer.bodyMatch.body ={};
                }
                


            }
        });
