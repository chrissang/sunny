var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ugWeb = '//www.uncommongoods.com';
var Dependents = (function () {
    function Dependents(params) {
        this.isAllowedMoreItems = ko.observable(false);
        this.upvoteCounter = ko.observable(0);
        this.isItemDownvoted = ko.observable(false);
        this.viewModelItemId = ko.observable('');
        this.viewModelImage = ko.observable('');
        this.viewModelTitle = ko.observable('');
        this.viewModelPrice = ko.observable('');
        this.viewModelTagLine = ko.observable('');
        this.viewModelAvgRating = ko.observable('');
        this.viewModelNumberOfReviews = ko.observable('');
        this.viewModelProductURL = ko.observable('');
        this.viewModelAltImg = ko.observableArray();
        this.viewModelMultiSku = ko.observableArray();
        this.upvoteMessage1 = ko.observable('Nice Choice! I added more suggestions.');
        this.upvoteMessage2 = ko.observable('You starred it,<br> I saved it!');
        this.isUpVoteMessage1 = ko.observable(false);
        this.isUpVoteMessage2 = ko.observable(false);
        this.closeUpVoteMessage1 = function () {
            this.isUpVoteMessage1(false);
        };
        this.closeUpVoteMessage2 = function () {
            this.isUpVoteMessage2(false);
        };
        this.filterMinPrice = ko.observable('');
        this.filterMaxPrice = ko.observable('');
        this.itemQuantity = ko.observableArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        this.productParent = ko.observable();
        this.upVotedResults = ko.observableArray([]);
        this.upVotedResultsLen = ko.observable(0);
        this.displayUpVotedResults = ko.observable(false);
        this.displaySearchResultsToggle = ko.observable(true);
    }
    return Dependents;
}());
ko.components.register('upvoted-results', {
    viewModel: (function (_super) {
        __extends(UpVotedResultsComponentModel, _super);
        function UpVotedResultsComponentModel(params) {
            _super.call(this, params);
            this.params = params;
            ko.bindingHandlers.getItemDescription = {
                update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var itemId = valueAccessor();
                    $.getJSON("http://www.uncommongoods.com/assets/get/item/" + itemId, function (itemdata) {
                        element.innerHTML = itemdata[0].metaDescr;
                    });
                }
            };
        }
        return UpVotedResultsComponentModel;
    }(Dependents)),
    template: "\n        <div class=\"row upvotedResultsContainer\">\n            <div class=\"small-12 columns\">\n            <!-- ko foreach: $parent.upVotedResults() -->\n                <div class=\"row container\">\n                    <div class=\"small-10 columns small-centered\">\n                        <div class=\"row\">\n                            <div class=\"small-12 medium-6 columns\">\n                                <a data-bind=\"attr: { href: $data.productURL(), target: '_blank' }\"><img data-bind=\"attr: { src: $data.imageURL() }\"></a>\n                            </div>\n                            <div class=\"small-12 medium-6 text-center columns\">\n                                <h1 data-bind=\"text: $data.title\"></h1>\n                                <div class=\"intro-text itemDescription\" data-bind=\"getItemDescription: $data.itemId()\"></div>\n                                <p class=\"item-price price\">\n                                    <span data-bind=\"text: $data.price()\"></span>\n                                </p>\n                                <div class=\"avgRating\">\n                                    <span data-bind=\"attr: { class: 'fontStars-'+ $data.rating().toString().replace('.','_') }\"></span><span class=\"body-mini\">(<span data-bind=\"text: $data.numberOfReviews() != '' ? $data.numberOfReviews() : '0'\"></span>)</span>\n                                </div>\n                            </div>\n\n                            <div class=\"small-12 medium-6  columns\">\n                                <div class=\"row selectQuanity\">\n                                    <div class=\"small-3 columns\">\n                                        <select data-bind=\"options: $parent.itemQuantity()\"></select>\n                                    </div>\n                                    <div class=\"small-9 columns\">\n                                        <a data-bind=\"attr: { href: $data.productURL(), target: '_blank' }\"><input type=\"button\" value=\"add to cart\" class=\"urgent expand\"></a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"small-12 columns\">\n                        <hr class=\"solidHorizontalLine\">\n                    </div>\n                </div>\n            <!-- /ko -->\n            </div>\n        </div>", synchronous: true
});
ko.components.register('quickview', {
    viewModel: (function (_super) {
        __extends(QuickViewComponentModel, _super);
        function QuickViewComponentModel(params) {
            _super.call(this, params);
            this.params = params;
            this.quickViewDownVote = function () {
                var parentProduct = this.params.parent.productParent();
                if (!parentProduct.displayUpVoteSelected()) {
                    parentProduct.displayDownVoteSelected(true);
                    parentProduct.isAllowedMoreItems(true);
                    parentProduct.isItemDownvoted(true);
                }
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            };
            this.quickViewUpVote = function () {
                var parentProduct = this.params.parent.productParent();
                // console.log('quickViewUpVote ',parentProduct);
                if (!parentProduct.displayUpVoteSelected()) {
                    parentProduct.isAllowedMoreItems(true);
                    this.params.parent.upvoteCounter() === 0 ? this.params.parent.isUpVoteMessage1(true) : '';
                    this.params.parent.upvoteCounter() != 2 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                    this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? this.params.parent.isUpVoteMessage2(true) : this.params.parent.isUpVoteMessage2(false);
                    this.params.parent.upVotedResults.push(this.params.parent.productParent());
                    parentProduct.displayUpVoteSelected(true);
                }
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            };
            this.closeQuickView = function () {
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            };
            this.swapMainImage = function (img) {
                this.params.parent.viewModelImage(img.split('64px')[0] + '640px.jpg');
            };
            ko.bindingHandlers.swpierInit = {
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    $(document).ready(function () {
                        var altSwiper = new Swiper('#altImages', {
                            loop: false,
                            nextButton: '.swiper-button-next',
                            prevButton: '.swiper-button-prev',
                            slidesPerView: 5,
                            spaceBetween: 12,
                            slidesOffsetBefore: 27,
                            slidesOffsetAfter: 27,
                            breakpoints: {
                                1024: {
                                    slidesPerView: 5
                                },
                                640: {
                                    slidesPerView: 5
                                },
                                320: {
                                    slidesPerView: 5
                                }
                            }
                        });
                    });
                }
            };
        }
        return QuickViewComponentModel;
    }(Dependents)),
    template: "\n        <div id=\"sunnyQuickViewModal\" class=\"reveal-modal xlarge\" data-reveal=\"\" aria-hidden=\"true\" role=\"dialog\">\n            <div class=\"row\">\n                <div class=\"small-12 columns\">\n                    <a data-bind=\"event:{ click: closeQuickView.bind() }\">\n                        <span class=\"icon-close icon-lg right\"></span>\n                    </a>\n                </div>\n\n                <div class=\"small-12 medium-7 columns\">\n                    <a data-bind=\"attr: { href: $parent.viewModelProductURL(), target: '_blank' }\"><img data-bind=\"attr: { src: $parent.viewModelImage() }\"></a>\n\n                    <div class=\"swiper-container\" id=\"altImages\">\n                        <div class=\"swiper-wrapper\">\n                            <!-- ko foreach: $parent.viewModelAltImg() -->\n                                <div class=\"swiper-slide\" style=\"width: auto; margin-right: 12px;\">\n                                    <a data-bind=\"event: { click: $parent.swapMainImage.bind($parent) }\">\n                                        <img data-bind=\"attr:{ src: $data, alt: $parent.params.parent.viewModelTitle()+' thumbnail' }, swpierInit\"></img>\n                                    </a>\n                                </div>\n                            <!-- /ko -->\n                        </div>\n                        <div class=\"swiper-button-prev\"><span class=\"icon-caret_left icon-lg\"></span></div>\n                        <div class=\"swiper-button-next\"><span class=\"icon-caret_right icon-lg\"></span></div>\n                    </div>\n                </div>\n\n                <div class=\"small-12 medium-5 text-center columns copy\">\n                    <div class=\"row\">\n                        <!-- <div class=\"small-12 columns\" id=\"quickViewVotingContainer\">\n                            <div class=\"votingContainer\">\n                                <a data-bind=\"event: { click: quickViewDownVote.bind($data) }\"><img class=\"voteBtns downVote\" src=\"/images/SUN-thumb_boo.png\"></a>\n                                <a data-bind=\"event: { click: quickViewUpVote.bind($data) }\"><img class=\"voteBtns upVote\" src=\"/images/SUN-thumb_yay.png\"></a>\n                            </div>\n                        </div> -->\n\n                        <div class=\"small-12 columns\">\n                            <h1 data-bind=\"text: $parent.viewModelTitle()\"></h1>\n                        </div>\n                        <div class=\"small-12 columns\">\n                            <div class=\"intro-text itemDescription\" data-bind=\"html: $parent.viewModelTagLine()\"></div>\n                        </div>\n                        <div class=\"small-12 columns\">\n                            <p class=\"item-price price\">\n                                <span data-bind=\"text: $parent.viewModelPrice()\"></span>\n                            </p>\n                        </div>\n                        <div class=\"small-12 columns\">\n                            <div class=\"avgRating\">\n                                <span data-bind=\"attr: { class: 'fontStars-'+ $parent.viewModelAvgRating() }\"></span><span class=\"body-mini\">(<span data-bind=\"text: $parent.viewModelNumberOfReviews() != '' ? $parent.viewModelNumberOfReviews() : ''\"></span>)</span>\n                            </div>\n                        </div>\n                        <div class=\"small-12 columns\">\n                            <div class=\"row selectQuanity\">\n                                <!-- ko if: $parent.viewModelMultiSku().length <= 1 -->\n                                    <div class=\"small-4 columns\">\n                                        <select data-bind=\"options: itemQuantity()\"></select>\n                                    </div>\n\n                                    <div class=\"small-8 columns\">\n                                        <a data-bind=\"attr: { href: $parent.viewModelProductURL(), target: '_blank' }\"><input type=\"button\" value=\"add to cart\" class=\"urgent expand\"></a>\n                                    </div>\n                                <!-- /ko -->\n\n                                <!-- ko if: $parent.viewModelMultiSku().length > 1 -->\n                                    <div class=\"small-8 columns\">\n                                        <select data-bind=\"options: $parent.viewModelMultiSku()\"></select>\n                                    </div>\n\n                                    <div class=\"small-4 columns\">\n                                        <select data-bind=\"options: itemQuantity()\"></select>\n                                    </div>\n\n                                    <div class=\"small-12 columns\">\n                                        <a data-bind=\"attr: { href: $parent.viewModelProductURL(), target: '_blank' }\"><input type=\"button\" value=\"add to cart\" class=\"urgent expand\"></a>\n                                    </div>\n                                <!-- /ko -->\n\n                                <div class=\"small-12 columns\">\n                                    <a class=\"body-small a-tertiary\" data-bind=\"attr: { href: $parent.viewModelProductURL(), target: '_blank' }\">view full details</a>\n                                </div>\n                            </div>\n                        </div>\n\n\n\n                    </div>\n                </div>\n            </div>\n        </div>", synchronous: true
});
ko.components.register('products', {
    viewModel: (function (_super) {
        __extends(ProductsComponentModel, _super);
        function ProductsComponentModel(params) {
            _super.call(this, params);
            this.params = params;
            this.itemId = ko.observable(params.data.itemId);
            this.title = ko.observable(params.data.title);
            this.price = ko.observable(params.data.price);
            this.productURL = ko.observable(ugWeb + '/product/' + params.data.itemURL);
            this.imageURL = ko.observable(ugWeb + params.data.imageURL);
            this.numberOfReviews = ko.observable(params.data.noOfReviews);
            this.rating = ko.observable(params.data.rating.toString().replace('.', '_'));
            this.displayUpVoteSelected = ko.observable(false);
            this.displayDownVoteSelected = ko.observable(false);
            this.closeDownvoteModal = ko.observable(false);
            this.isloading = ko.observable(false);
            this.displayBorderSelected = function () {
                if (this.displayDownVoteSelected()) {
                    return 'downvotedBorder';
                }
                else if (this.displayUpVoteSelected()) {
                    return 'upvotedBorder';
                }
                else {
                    return '';
                }
            };
            this.downVote = function () {
                // console.log('down vote',this);
                this.displayDownVoteSelected(true);
                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.isItemDownvoted(true);
            };
            this.downVoteReasonSelection = function () {
                this.closeDownvoteModal(true);
                var self = this;
                setTimeout(function () {
                    self.displayDownVoteSelected(false);
                    self.closeDownvoteModal(false);
                }, 500);
                // console.log('down vote reason selected ',this.params.parent.searchResults()[0]);
                this.imageURL(ugWeb + this.params.parent.searchResults()[0].imageURL);
                this.title(this.params.parent.searchResults()[0].title);
                this.price(this.params.parent.searchResults()[0].price);
                this.itemId(this.params.parent.searchResults()[0].itemId);
                this.numberOfReviews(this.params.parent.searchResults()[0].noOfReviews);
                this.rating(this.params.parent.searchResults()[0].rating.toString().replace('.', '_'));
                this.productURL(ugWeb + '/product/' + this.params.parent.searchResults()[0].itemURL);
                this.params.parent.searchResults.splice(0, 1);
                this.isloading(true);
                var self = this;
                var upperCaseName = ko.computed(function () {
                    setTimeout(function () { self.isloading(false); }, 1000);
                });
                return true;
            };
            this.upVote = function () {
                //console.log('up vote ',this);
                this.params.parent.totalGiftIdeas(this.params.parent.displaySearchResults().length);
                this.params.parent.addItems(24);
                this.params.parent.isAllowedMoreItems(false);
                if (!this.displayUpVoteSelected()) {
                    this.params.parent.upvoteCounter() === 0 ? this.params.parent.isUpVoteMessage1(true) : '';
                    this.params.parent.upvoteCounter() != 3 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                    this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? (this.params.parent.isUpVoteMessage1(false), this.params.parent.isUpVoteMessage2(true)) : this.params.parent.isUpVoteMessage2(false);
                    this.params.parent.upVotedResults.push(this);
                    this.params.parent.upVotedResultsLen(this.params.parent.upVotedResults().length);
                    this.displayUpVoteSelected(true);
                }
            };
            this.displayQuickView = function (product) {
                this.params.parent.viewModelImage(this.imageURL().split('360px')[0] + '640px.jpg');
                this.params.parent.viewModelTitle(this.title());
                this.params.parent.viewModelPrice(this.price());
                this.params.parent.viewModelItemId(this.itemId());
                this.params.parent.viewModelNumberOfReviews(this.numberOfReviews());
                this.params.parent.viewModelAvgRating(this.rating());
                this.params.parent.viewModelProductURL(this.productURL());
                this.params.parent.productParent(this);
                var self = this;
                $.getJSON("http://www.uncommongoods.com/assets/get/item/" + this.params.parent.viewModelItemId(), function (itemdata) {
                    self.params.parent.viewModelTagLine(itemdata[0].metaDescr);
                    self.params.parent.viewModelAltImg([]);
                    self.params.parent.viewModelMultiSku([]);
                    var itemDir = '//www.uncommongoods.com/images/items/';
                    var itemId = itemdata[0].itemId;
                    var itemIdTrim = itemId.toString().slice(0, -2);
                    itemdata[0].itemMedia.forEach(function (mediaType, index) {
                        mediaType.mediaTypeId === 1 ? self.params.parent.viewModelAltImg.push(itemDir + itemIdTrim + '00/' + itemId + '_' + (index + 1) + '_64px.jpg') : '';
                    });
                    if (itemdata[0].skus.length > 1) {
                        itemdata[0].skus.forEach(function (sku, index) {
                            sku.status === 'live' ? self.params.parent.viewModelMultiSku.push(sku.color + ' $' + sku.price) : '';
                        });
                    }
                });
            };
            this.exitDownVoteReason = function () {
                this.closeDownvoteModal(true);
                var self = this;
                setTimeout(function () {
                    self.displayDownVoteSelected(false);
                    self.closeDownvoteModal(false);
                }, 500);
            };
            ko.bindingHandlers.slideUp = {
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    if (viewModel.displayDownVoteSelected()) {
                        $(element).css({ transform: 'translateY(0%)', '-webkit-transform': 'translateY(0%)', 'moz-transform': 'translateY(0%)', '-ms-transform': 'translateY(0%)', transition: '0.5s ease-in-out', '-webkit-transition': '0.5s ease-in-out', '-moz-transition': '0.5s ease-in-out' });
                    }
                    if (viewModel.closeDownvoteModal()) {
                        $(element).css({ transform: 'translateY(100%)', '-webkit-transform': 'translateY(100%)', 'moz-transform': 'translateY(100%)', '-ms-transform': 'translateY(100%)', transition: '0.5s ease-in-out', '-webkit-transition': '0.5s ease-in-out', '-moz-transition': '0.5s ease-in-out' });
                    }
                }
            };
            this.highlight = ko.observable(false);
            ko.bindingHandlers.toggleClick = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    var value = valueAccessor();
                    ko.utils.registerEventHandler(element, "click", function () {
                        value(!value());
                        if (value()) {
                            viewModel.upVote();
                        }
                        else {
                            viewModel.displayUpVoteSelected(false);
                            viewModel.params.parent.upVotedResults().forEach(function (product, index) {
                                if (viewModel.itemId() === product.itemId()) {
                                    viewModel.params.parent.upVotedResults().splice(index, 1);
                                    viewModel.params.parent.upVotedResultsLen(viewModel.params.parent.upVotedResults().length);
                                }
                            });
                        }
                    });
                }
            };
        }
        return ProductsComponentModel;
    }(Dependents)),
    template: "\n        <!-- ko if: params.data.display() -->\n            <li>\n                <article class=\"product\" data-bind=\"attr: { id: itemId() }\">\n                    <div class=\"responsively-lazy preventReflow\">\n                        <!-- ko if: !displayUpVoteSelected() && !displayDownVoteSelected() -->\n                            <a data-bind=\"event:{ click: downVote.bind($data) }\"><span class=\"icon-close icon-md\"></span></a>\n                        <!-- /ko -->\n\n                        <!--<a data-reveal-id=\"sunnyQuickViewModal\" data-bind=\"event: { click: displayQuickView.bind($data) }\"><img data-bind=\"attr: { src: imageURL(), class: displayBorderSelected() }\"></a>-->\n\n                        <a data-bind=\"attr: { href: productURL, target: '_blank' }\"><img data-bind=\"attr: { src: imageURL(), class: displayBorderSelected() }\"></a>\n\n                        <div data-bind=\"attr: { class: displayDownVoteSelected() ? 'downVoteReasonContainer border' : 'downVoteReasonContainer' }\">\n                            <div data-bind=\"if: displayDownVoteSelected(), attr: { class: displayDownVoteSelected() ? 'downVoteReason' : 'downVoteReason' }, slideUp\">\n                                <ul>\n                                    <li>\n                                        <input type=\"radio\" data-bind=\"attr:{ 'name': 'downVoteReason1_'+ itemId(), 'id': 'downVoteReason1_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }\">\n                                        <label data-bind=\"attr:{ for: 'downVoteReason1_'+ itemId() }\">I don't like this item</label>\n                                    </li>\n                                    <li>\n                                        <input type=\"radio\" data-bind=\"attr:{ 'name': 'downVoteReason2_'+ itemId(), 'id': 'downVoteReason2_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }\">\n                                        <label data-bind=\"attr:{ for: 'downVoteReason2_'+ itemId() }\">I don't like this style</label>\n                                    </li>\n                                    <li>\n                                        <input type=\"radio\" data-bind=\"attr:{ 'name': 'downVoteReason3_'+ itemId(), 'id': 'downVoteReason3_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }\">\n                                        <label data-bind=\"attr:{ for: 'downVoteReason3_'+ itemId() }\">Don't show me kitchen & bar</label>\n                                    </li>\n                                    <li>\n                                        <input type=\"radio\" data-bind=\"attr:{ 'name': 'downVoteReason4_'+ itemId(), 'id': 'downVoteReason4_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }\">\n                                        <label data-bind=\"attr:{ for: 'downVoteReason4_'+ itemId() }\">Don't show me dishware</label>\n                                    </li>\n                                    <li>\n                                        <input type=\"radio\" data-bind=\"attr:{ 'name': 'downVoteReason5_'+ itemId(), 'id': 'downVoteReason5_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }\">\n                                        <label data-bind=\"attr:{ for: 'downVoteReason5_'+ itemId() }\">Other reason</label>\n                                    </li>\n                                </ul>\n\n                                <a data-bind=\"event:{ click: exitDownVoteReason.bind($data) }\" class=\"exitDownVoteReason\">\n                                    <span class=\"icon-caret_down icon-md right\"></span>\n                                </a>\n                            </div>\n                        </div>\n\n                        <div data-bind=\"attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'votingContainer text-center upvoted stars' : 'votingContainer text-center stars' }\">\n                            <!-- ko if: !displayDownVoteSelected() -->\n                                <div data-bind=\"attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'innerCircle outterCircle upvoted' : 'outterCircle' }\">\n                                    <div data-bind=\"attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'innerCircle upvoted' : 'innerCircle' }\">\n                                        <!--<a data-bind=\"event:{ click: upVote.bind($data) }\"><span class=\"icon-star\"></span></a>-->\n                                        <a data-bind=\"toggleClick: highlight\"><span class=\"icon-star\"></span></a>\n                                    </div>\n                                </div>\n                            <!-- /ko -->\n                        </div>\n\n                        <!-- ko if: isloading() -->\n                            <div class=\"loadingSvg\">\n                                <embed type=\"image/svg+xml\" src=\"/images/frame/loader.svg\" style=\"width:3rem\">\n                            </div>\n                        <!-- /ko -->\n                    </div>\n\n                    <div data-bind=\"attr: { class: displayUpVoteSelected() ? 'copy borderAdded upvoted' : displayDownVoteSelected() ? 'copy borderAdded downvoted' : 'copy' }\">\n                        <h4>\n                            <a class=\"a-secondary\" data-bind=\"attr: { href: productURL() }\">\n                            <span data-bind=\"text: title()\"></span></a>\n                        </h4>\n                        <p class=\"body-small price\" data-bind=\"text: price()\"></p>\n                    </div>\n                </article>\n            </li>\n        <!-- /ko -->", synchronous: true
});
ko.components.register('price-filiter', {
    viewModel: (function (_super) {
        __extends(PriceFiliterComponentModel, _super);
        function PriceFiliterComponentModel(params) {
            _super.call(this, params);
            this.params = params;
            this.upVotedItemIdArry = ko.observableArray([]);
            this.filterByPrice = function () {
                var _this = this;
                var min = parseFloat(parseFloat(this.params.parent.filterMinPrice()).toFixed(2));
                var max = parseFloat(parseFloat(this.params.parent.filterMaxPrice()).toFixed(2));
                var totalResults = this.params.parent.displaySearchResults().length;
                var hiddenCounter = 0;
                this.upVotedItemIdArry([]);
                this.params.parent.upVotedResults().forEach(function (viewModel, index) {
                    _this.upVotedItemIdArry.push(viewModel.params.data.itemId);
                });
                while (totalResults--) {
                    var item = this.params.parent.displaySearchResults()[totalResults];
                    if (this.upVotedItemIdArry().indexOf(item.itemId) === -1) {
                        parseFloat(item.price.split('$')[1]) < min || parseFloat(item.price.split('$')[1]) > max ? (item.display(false), hiddenCounter++) : item.display(true);
                    }
                }
                this.params.parent.totalGiftIdeas(this.params.parent.displaySearchResults().length - hiddenCounter);
            };
        }
        return PriceFiliterComponentModel;
    }(Dependents)),
    template: "\n        <div class=\"small-12 small-centered columns prieFilterContainer\">\n            <div class=\"row\">\n                <div class=\"small-12 medium-5 large-6 columns\">\n                    <h3>gifts for coffee lover</h3>\n                    <a class=\"a-secondary\"><i class=\"body-small\">start over</i></a>\n                </div>\n\n                <div class=\"small-12 medium-7 large-6 columns\">\n                    <div class=\"flex\">\n                        <p class=\"nav-fam priceCopy\">PRICE RANGE:</p>\n                        <input class=\"minMaxPrice\" type=\"number\" placeholder=\"$\" data-bind=\"value: $parent.filterMinPrice\">\n                        <p class=\"priceToCopy\">to</p>\n                        <input class=\"minMaxPrice\" type=\"number\" placeholder=\"$\" data-bind=\"value: $parent.filterMaxPrice\">\n                        <button data-bind=\"event:{ click: filterByPrice }\" class=\"btn-micro-secondary\">APPLY</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ", synchronous: true
});
ko.components.register('sunny-results-container', {
    viewModel: (function (_super) {
        __extends(sunnyResultsComponentModel, _super);
        function sunnyResultsComponentModel(params) {
            _super.call(this, params);
            this.searchResults = ko.observableArray([]).extend({ deferred: true });
            this.isInitItemsLoaded = false;
            this.totalGiftIdeas = ko.observable();
            this.isDisplayGateCopy = ko.observable(false);
            this.displaySearchResults = ko.observableArray([]);
            this.displaySearchResultsTemp = ko.observableArray([]);
            this.isGiftsYouLikeBtn = ko.observable(false),
                this.suggestionsBtn = ko.observable(true),
                this.toggleGiftsYouLike = function () {
                    this.upVotedResults().length > 0 ? (this.isGiftsYouLikeBtn(true), this.suggestionsBtn(false), this.displaySearchResultsToggle(false), this.displayUpVotedResults(true)) : this.isGiftsYouLikeBtn(false);
                },
                this.toggleSuggestions = function () {
                    this.displayUpVotedResults(false);
                    this.displaySearchResultsToggle(true);
                    this.suggestionsBtn(true);
                    this.isGiftsYouLikeBtn(false);
                },
                this.addItems = function (load) {
                    var _this = this;
                    this.displaySearchResultsTemp.removeAll();
                    this.isDisplayGateCopy(false);
                    var itemsToAdd = load;
                    var hiddenCounter = 0;
                    while (itemsToAdd--) {
                        this.searchResults()[itemsToAdd]['display'] = ko.observable(true);
                        if (this.filterMinPrice() != '' || this.filterMaxPrice() != '') {
                            var price = this.searchResults()[itemsToAdd] ? parseFloat(this.searchResults()[itemsToAdd].price.split('$')[1]) : '';
                            if (price >= this.filterMinPrice() && price <= this.filterMaxPrice()) {
                                this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                                this.searchResults.splice(itemsToAdd, 1);
                            }
                        }
                        else if (this.searchResults()[itemsToAdd]) {
                            this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                            this.searchResults.splice(itemsToAdd, 1);
                        }
                    }
                    this.displaySearchResultsTemp.reverse();
                    this.displaySearchResultsTemp().forEach(function (product, index) {
                        _this.displaySearchResults.push(product);
                    });
                    this.displaySearchResults().forEach(function (item, index) {
                        item.display() ? hiddenCounter++ : '';
                    });
                    this.totalGiftIdeas(hiddenCounter);
                };
            self = this;
            $.getJSON("/js/coffee_search_results.json", function (data) {
                data.products.forEach(function (product, index) {
                    self.searchResults.push(product);
                });
            });
            ko.bindingHandlers.scroll = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    window.onbeforeunload = function () {
                        window.scrollTo(0, 0);
                    };
                },
                update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                    if (self.searchResults().length != 0 && !self.isInitItemsLoaded) {
                        viewModel.addItems(18);
                        self.isInitItemsLoaded = true;
                    }
                    if (self.isInitItemsLoaded) {
                        //***********************************************************************
                        // var lastScrollTop = 0;
                        //    $(window).on('scroll', function() {
                        //        var st = $(this).scrollTop();
                        //        if(st < lastScrollTop) {
                        //            console.log('up 1');
                        //        }
                        //        else {
                        //            console.log('down 1');
                        //        }
                        //        lastScrollTop = st;
                        //    });
                        //***********************************************************************
                        var lastScrollTop = 0;
                        $(window).on('scroll', function () {
                            var st = $(this).scrollTop();
                            if (st < lastScrollTop) {
                                //console.log('up 1 ',self.isDisplayGateCopy());
                                self.isDisplayGateCopy(false);
                            }
                            else {
                                //console.log('down 1');
                                if (($(document).height() <= $(window).height() + $(window).scrollTop())) {
                                    if (self.isAllowedMoreItems()) {
                                        viewModel.addItems(24);
                                    }
                                    else {
                                        animateGateIn();
                                    }
                                }
                            }
                            lastScrollTop = st;
                        });
                    }
                    function animateGateIn() {
                        // bounce animated
                        $.fn.extend({
                            animateCss: function (animationName) {
                                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                                this.addClass('animated ' + animationName).one(animationEnd, function () {
                                    $(this).removeClass('animated ' + animationName);
                                });
                            }
                        });
                        $('#sunnyResults').animateCss('bounce');
                        self.isDisplayGateCopy(true);
                    }
                }
            };
        }
        return sunnyResultsComponentModel;
    }(Dependents)),
    template: "\n        <!-- Fixed Header -->\n        <header class=\"sunnyResultsHeader\">\n            <div class=\"row fullWidth\">\n                <div class=\"small-12 columns ugCondensedHeaderContainer\">\n                    <div class=\"ugHeader\">\n                        <div class=\"logo-container\">\n                            <svg xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"91\" version=\"1.1\" viewBox=\"-5 0 610 91\"><g transform=\"translate(0,-961.36215)\"><g transform=\"matrix(0.88125356,0,0,0.88125356,-1.1665022,959.21629)\"><path d=\"m48 73.9c0.1-7.7 0.3-34.8-0.1-37.5-1.4-1.1-8.2-1-9.7 0-0.5 3.5-0.5 21.6-0.6 30.8-2.2 3.6-8.4 6-13.4 6-2.7 0-5.5-1.7-5.5-5.7 0-2.6 0.5-25.3 0.3-27.4-0.3-3-2.2-4.5-7.9-4.5-5 0-8.2 1.7-8.2 4.5v3.8H9.3C8.9 51.2 8.4 66.8 9.2 71.4c1.2 7.1 5.7 11.7 12.8 11.7 6.2 0 14-3.2 16.4-7.3 0.1 0 0.3 0 0.3 0-0.2 0.5-0.3 1.3-0.3 2.2 0 3 2 4.5 7.6 4.5 5 0 8.2-2.3 8.2-5.1v-3.5h-6.2zM61.3 43.8 61.3 43.8 61.3 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5C99 39.2 94.5 34.6 87.4 34.6c-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1l0 3.5h6.2z\" class=\"logo-blue\" \"#387d9b\"=\"\"></path><path d=\"M7.2 13.5C5.1 11.4 3.6 12.1 2.4 13.3c-1.2 1.2-1.7 2.9 0.2 4.8 1.6 1.6 8 6.3 11 7.7 0.8 0.4 1.8-0.5 1.4-1.3-1.4-2.9-6.2-9.5-7.7-11zM51.7 13.3 51.7 13.3 51.7 13.3c-1.2-1.2-2.7-1.9-4.8 0.2-1.6 1.6-6.4 8.1-7.7 11-0.4 0.8 0.6 1.7 1.4 1.3 2.9-1.4 9.4-6.1 11-7.7 1.9-1.9 1.4-3.6 0.2-4.8zM27 2.7c-1.7 0-3.3 0.8-3.3 3.6 0 2.2 1.2 16.2 2.3 19.2 0.3 0.9 1.6 0.9 1.9 0.1 1.1-3 2.3-17.1 2.3-19.3 0-3-1.6-3.6-3.3-3.6z\" class=\"logo-green\"></path><path d=\"m194.1 58.5c0-20.7-10.7-23.9-22-23.9-11.3 0-22 4.9-22 23.9 0 19 10.7 23.9 22 23.9 11.3 0 22-3.2 22-23.9zm-22 15.8c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 6 0 11.7 2.1 11.7 16 0 14.2-5.7 15.8-11.7 15.8zM384.2 58.5 384.2 58.5 384.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM391.6 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2zM334.5 73.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0.1c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0-2-4.6-6-7.3-11.5-7.3-6.2 0-13.7 3.2-16.1 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.1-6.9 13.1-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-5.9 0.7-17.2 0.4-23.8 2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-6 0.7-17.4 0.4-23.9l0 0.2c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.3-5.9 0.7-17.3 0.4-23.8l0 0.1c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8zM143.6 71.8c-2.4 1.2-9.6 2.2-12.9 2.2-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 2.2 0 4.2 0.3 5.8 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.5h0c0-4.1-4.4-7.6-15.1-7.6-11.3 0-23 4.9-23 23.9 0 19 10.7 23.9 22 23.9 5.7 0 12.4-1.7 15-3.4 2.4-1.6 0-6.8-2.2-6.8z\" class=\"logo-blue\"></path><path d=\"m538.4 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zM514.9 75.1c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM589.2 58.5 589.2 58.5 589.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM682.2 68.5c0-15.3-24.6-14-24.6-21.9 0-3.9 1.6-5.7 7.7-5.7 2.2 0 3.9 0.3 5.5 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.4l0 0c0-4.1-4.1-7.6-14.8-7.6-11.3 0-18.5 3.9-18.5 14.5 0 14.4 24.4 12.8 24.4 21 0 3.8-1.5 5.6-7.5 5.6-3.6 0-5.6-0.5-7-1.4 0-7.5-1.7-8.2-4.5-8.2h-1.2c-3 0-4.5 1.2-4.5 9.5l0 0c0 4.1 5.6 7.9 16.3 7.9 11.3 0 18.5-2.6 18.5-13.5zM490.1 40.2c0-2.8-3.3-5.1-8.2-5.1-4.8 0-7 1.1-7.5 3.3-3.1-2.4-7.3-4-12-4-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.7 0 7.7-1.1 10.9-2.7 0 1.6 0 2.5 0 2.5 0 13.9-6 15.7-12 15.7-3.3 0-10.5-1-12.9-2.2-2.2 0.1-4.5 5.3-2.2 6.8 2.7 1.8 9.3 3.4 15 3.4 11.3 0 22.3-4.9 22.3-23.9 0 0 0-30.5-0.1-38.2h6.2l0-3.5zm-27.3 33.7c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.7 0 9.2 2.7 10.9 6.7l-0.1 1.5c0 4.9 0 13.6 0.1 20.6-3.4 2.1-8.1 3-10.8 3zM643.8 73.6h-6.4c0.3-5 0.6-13.9 0.5-20.5 0.3-6.8 0.3-19.7 0.3-27 0-3.6 0-8.8-0.6-10.7-0.9-2.8-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c0 3.5-0.1 11.1-0.1 18.5-3-2.2-7.1-3.7-11.6-3.7-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.4 0 7.7-1.5 11-4.2 0.5 2.7 2.5 4 7.9 4 5 0 8.2-1.7 8.2-4.5l0-3.8zm-27.1 0.3c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.9 0 9.7 3 11.1 7.4 0 1 0 1.9 0 2.7-0.1 3.7-0.2 10.8-0.2 16.5-3.1 3.5-6.5 5.2-10.9 5.2z\" class=\"logo-green headerLogo\"></path></g></g></svg>\n                        </div>\n                        <div class=\"cartTop cartTopNoClick\" id=\"cartTopShoppingBasket\">\n            \t\t\t\t<span id=\"myCart\" onclick=\"if (oldGaEnabled) _gaq.push(['_trackEvent', 'header', 'click', 'my cart']);\">\n            \t\t\t\t<span class=\"gtmMiniCart icon-cart icon-md\" data-cartitems=\"0\"></span>\n            \t\t\t\t</span>\n            \t\t\t\t<a id=\"checkoutButton\" href=\"https://www.uncommongoods.com/checkout/basket\" onclick=\"javascript: pageTracker._trackPageview('/internal/checkout/basket?source=header');\">checkout</a>\n            \t\t        <div id=\"cartBot\" class=\"cartBottom\"></div>\n                \t    </div>\n                    </div>\n                </div>\n\n                <div class=\"small-12 columns\">\n                    <div class=\"sunnyHeader\">\n                        <div data-bind=\"attr: { class: suggestionsBtn() ? 'suggestionsContainer bkgColorOn' : 'suggestionsContainer' }\">\n\n                            <div data-bind=\"attr: { class: isUpVoteMessage1() ? 'upvotePrompt suggestions animateIn' : 'upvotePrompt suggestions animateOut' }\">\n                                <a data-bind=\"event:{ click: closeUpVoteMessage1.bind($data) }\">\n                                    <p data-bind=\"text: upvoteMessage1(), attr: { class: isUpVoteMessage1() ? 'intro-text animateIn' : 'intro-text' }\"></p>\n                                </a>\n                            </div>\n\n                            <div class=\"superCheckCounterBtn\">\n                                <input data-bind=\"checked: suggestionsBtn, event:{ click: toggleSuggestions() }\" id=\"suggestions\" type=\"checkbox\">\n                                <label class=\"super-check counter\" for=\"suggestions\">\n\n                                    <div data-bind=\"attr: { class: isUpVoteMessage1() ? 'suggestionsCircleOuter fill' : 'suggestionsCircleOuter' }\">\n                                        <div data-bind=\"text: totalGiftIdeas(), attr:{ class: isUpVoteMessage1() ? 'innerCircle animateIn' : ( upVotedResultsLen() >= 1 ? 'innerCircle hideInnerCircle' : 'innerCircle')}\"></div>\n                                        <div data-bind=\"text: totalGiftIdeas(), attr:{ class: isUpVoteMessage1() ? 'count animateIn' : ( upVotedResultsLen() >= 1 ? 'count updateColor' : 'count')}\"></div>\n                                    </div>\n\n                                    <h2 class=\"circleLeft\">suggestions</h2>\n                                </label>\n                            </div>\n                        </div>\n\n                        <div data-bind=\"attr: { class: isGiftsYouLikeBtn() ? 'giftsYouLikeContainer bkgColorOn' : 'giftsYouLikeContainer' }\">\n                            <div data-bind=\"attr: { class: isUpVoteMessage2() ? 'upvotePrompt giftsYouLike animateIn' : 'upvotePrompt giftsYouLike animateOut' }\">\n                                <a data-bind=\"event:{ click: closeUpVoteMessage2.bind($data) }\">\n                                    <p data-bind=\"html: upvoteMessage2(), attr: { class: isUpVoteMessage2() ? 'intro-text animateIn' : 'intro-text' }\"></p>\n                                </a>\n                            </div>\n                            <div class=\"superCheckCounterBtn\">\n                                <input data-bind=\"checked: isGiftsYouLikeBtn, event:{ click: toggleGiftsYouLike() }\" id=\"giftsSaved\" type=\"checkbox\">\n                                <label class=\"super-check counter\" for=\"giftsSaved\">\n                                    <h2 data-bind=\"text: 'gifts you like'\" class=\"circleRight\"></h2>\n\n                                    <!-- ko if: upVotedResultsLen() > 0 -->\n                                        <div data-bind=\"attr: { class: isUpVoteMessage2() ? 'giftsYouLikeCircleOuter fill' : 'giftsYouLikeCircleOuter' }\">\n                                            <div data-bind=\"text: upVotedResultsLen() > 0 ? upVotedResultsLen() : '', attr:{ class: isUpVoteMessage2() ? 'innerCircle animateIn' : ( upVotedResultsLen() > 0 ? 'innerCircle hideInnerCircle' : 'innerCircle') }\"></div>\n                                            <div data-bind=\"text: upVotedResultsLen() > 0 ? upVotedResultsLen() : '', attr:{ class: isUpVoteMessage2() ? 'count animateIn' : ( upVotedResultsLen() > 0 ? 'count updateColor' : 'count') }\"></div>\n                                        </div>\n                                    <!-- /ko -->\n                                </label>\n                            </div>\n                        </div>\n\n                        <div class=\"sunnyIcon\"></div>\n                    </div>\n                </div>\n            </div>\n        </header>\n\n        <!-- Search Results -->\n        <div id=\"sunnyResults\" class=\"row fullwidth sunnySearchResults\" data-bind=\"scroll, visible: displaySearchResultsToggle()\">\n\n            <price-filiter params='parent: $data'></price-filiter>\n\n            <div class=\"small-10 small-centered columns\">\n                <ul id=\"results\" class=\"small-block-grid-2 medium-block-grid-3\" data-bind=\"foreach: displaySearchResults()\">\n                    <!-- ko component: {name: 'products', params: { data: $data, parent: $parent  } } --><!-- /ko -->\n                </ul>\n            </div>\n\n            <div id=\"gate\" class=\"small-12 text-center columns fullWidth\">\n                <div data-bind=\"attr: { class: isDisplayGateCopy() ? 'gate unhide' : 'gate' }\">\n                    <div data-bind=\"attr: { class: isDisplayGateCopy() ? 'animateGate animate' : 'animateGate'}\">\n                        <p class='call-out-large'>\"For more ideas, star a few items!\"</p>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <!-- Search Results End-->\n\n        <!-- ko if: displayUpVotedResults() -->\n            <!-- ko component: {name: 'upvoted-results', params: { parent: $data } } --><!-- /ko -->\n        <!-- /ko -->", synchronous: true
});
ko.applyBindings();
