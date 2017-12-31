(function () {
    'use strict';
    angular.module('NarrowItDown', [])
           .controller('narrowItDownController', NarrowItDownController)
           .service('menuSearchService', MenuSearchService)
           .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['menuSearchService'];
    function NarrowItDownController(menuSearchService) {
        var narrowCtrl = this;
        narrowCtrl.search = function(searchTerm)
                                {
                                              menuSearchService.getMatchedMenuItems(searchTerm)
                                                               .then(result => {
                                                                      narrowCtrl.found = result;
                                                                               });
                                };
                                narrowCtrl.removeItem = function(index) {
                                narrowCtrl.found.splice(index, 1);
        };
    };

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'found',
            bindToController: true
        };
        return ddo;
    };

    function FoundItemsDirectiveController() {
        var found = this;
        found.nothingFound = function () {
            return found.items && found.items.length === 0;
        };
    };

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;
        service.getMatchedMenuItems = function(searchTerm) {
            return $http.get('https://davids-restaurant.herokuapp.com/menu_items.json')
                .then(function (result) {
                    if(!searchTerm) {
                        return [];
                    }
                    var foundItems = result.data.menu_items.filter(item => item.description.indexOf(searchTerm) !== -1);
                    return foundItems;
                });
        }
    };
})();