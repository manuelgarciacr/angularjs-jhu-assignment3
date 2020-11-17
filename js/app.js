(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItemsDirective);

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                searchTerm: '<',
                searchItems: '&',
                items: '<',
                onRemove: '&'
            },
            link: FoundItemsDirectiveLink
        };

        return ddo;
    }

    function FoundItemsDirectiveLink(scope, element, attrs, controller) {
        console.log("Link scope is: ", scope);
        console.log("Element is: ", element);
        console.log("Attrs are: ", attrs);
        console.log("Controller instance is: ", controller);
        console.log(scope.items, attrs.items)
        scope.$watch('items.length', function (newValue) {
            var warningElem = element.find("strong");
            if (newValue)
                warningElem.removeClass('cls-block');
            else
                warningElem.addClass('cls-block');
        })
        scope.$watch('searchTerm', function (newValue) {
            scope.searchItems();
        })
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var narrowItDown = this;

        narrowItDown.removeItem = function (itemIndex) {
            narrowItDown.items.splice(itemIndex, 1);
        };

        narrowItDown.getItems = function () {
            MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm || '').then(data =>
                narrowItDown.items = data
            );
        }

        narrowItDown.getItems();
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            const PARMS = {
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            };

            return $http(PARMS).then(function (result) {
                // process result and only keep items that match
                var items = result.data.menu_items;
                var foundItems = items.filter(item => searchTerm === '' || item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0);
                // return processed items
                return foundItems;
            });
        };
    }

})();
