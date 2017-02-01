const ugWeb = '//www.uncommongoods.com';

class Dependents {
    constructor(params) {
        this.isAllowedMoreItems = ko.observable(false);
        this.isProTip = ko.observable(false);
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

        this.itemQuantity = ko.observableArray([0,1,2,3,4,5,6,7,8,9,10]);
        this.productParent = ko.observable();
        this.upVotedResults = ko.observableArray([]);
        this.displayUpVotedResults = ko.observable(false);
        this.displaySearchResultsToggle = ko.observable(true);

        this.toggleSavedText = function() {
            if (this.upVotedResults().length > 0 && !this.displayUpVotedResults()) {
                history.pushState({ page: 'results' }, null, 'results');
                return 'SAVED GIFT IDEA';
            } else if (this.upVotedResults().length >= 0 && this.displayUpVotedResults()) {
                history.pushState({ page: 'upvote' }, null, 'upvote');
                return 'RETURN TO SUGGESTIONS';
            } else {
                return 'LIKE TO SAVE GIFT IDEAS';
            }
        }
    }
}

ko.components.register('upvoted-results', {
    viewModel: class UpVotedResultsComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            ko.bindingHandlers.getItemDescription = {
                update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                    var itemId = valueAccessor();
                    $.getJSON( "http://www.uncommongoods.com/assets/get/item/"+itemId, function( itemdata ) {
                        element.innerHTML = itemdata[0].metaDescr;
                    })
                }
            }
        }
    },
    template: `
        <div class="row upvotedResultsContainer">
            <div class="small-12 columns">
            <!-- ko foreach: $parent.upVotedResults() -->
                <div class="row container">
                    <div class="small-10 columns small-centered">
                        <div class="row">
                            <div class="small-6 columns">
                                <a data-bind="attr: { href: $data.productURL(), target: '_blank' }"><img data-bind="attr: { src: $data.imageURL() }"></a>
                            </div>
                            <div class="small-6 text-center columns">
                                <h1 data-bind="text: $data.title"></h1>
                                <div class="intro-text itemDescription" data-bind="getItemDescription: $data.itemId()"></div>
                                <p class="item-price price">
                                    <span data-bind="text: $data.price()"></span>
                                </p>
                                <div class="avgRating">
                                    <span data-bind="attr: { class: 'fontStars-'+ $data.rating().toString().replace('.','_') }"></span><span class="body-mini">(<span data-bind="text: $data.numberOfReviews() != '' ? $data.numberOfReviews() : '0'"></span>)</span>
                                </div>
                            </div>

                            <div class="small-6 columns">
                                <div class="row selectQuanity">
                                    <div class="small-3 columns">
                                        <select data-bind="options: $parent.itemQuantity()"></select>
                                    </div>
                                    <div class="small-9 columns">
                                        <a data-bind="attr: { href: $data.productURL(), target: '_blank' }"><input type="button" value="add to cart" class="urgent expand"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="small-12 columns">
                        <hr class="solidHorizontalLine">
                    </div>
                </div>
            <!-- /ko -->
            </div>
        </div>`, synchronous: true
});

ko.components.register('quickview', {
    viewModel: class QuickViewComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.quickViewDownVote = function() {
                var parentProduct = this.params.parent.productParent();
                if (!parentProduct.displayUpVoteSelected()) {
                    parentProduct.displayDownVoteSelected(true);
                    parentProduct.isAllowedMoreItems(true);
                    parentProduct.isItemDownvoted(true);
                }
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            }
            this.quickViewUpVote = function() {
                var parentProduct = this.params.parent.productParent();
                // console.log('quickViewUpVote ',parentProduct);
                if (!parentProduct.displayUpVoteSelected()) {
                    parentProduct.isAllowedMoreItems(true);
                    this.params.parent.upvoteCounter() === 0 ? this.params.parent.isProTip(true) : '';
                    this.params.parent.upvoteCounter() != 2 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                    this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? parentProduct.isTryDownVoteingProTip(true) : parentProduct.isTryDownVoteingProTip(false);
                    this.params.parent.upVotedResults.push(this.params.parent.productParent());
                    parentProduct.displayUpVoteSelected(true);
                }
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            }
            this.closeQuickView = function() {
                $('#sunnyQuickViewModal').foundation('reveal', 'close');
            }
            this.swapMainImage = function(img) {
                this.params.parent.viewModelImage(img.split('64px')[0]+'640px.jpg');
            }
            ko.bindingHandlers.swpierInit = {
                update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                    $(document).ready(function() {
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
                        })
                    })
                }
            };
        }
    },
    template: `
        <div id="sunnyQuickViewModal" class="reveal-modal xlarge" data-reveal="" aria-hidden="true" role="dialog">
            <div class="row">
                <div class="small-12 columns">
                    <a data-bind="event:{ click: closeQuickView.bind() }">
                        <span class="icon-close icon-lg right"></span>
                    </a>
                </div>

                <div class="small-12 medium-7 columns">
                    <a data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }"><img data-bind="attr: { src: $parent.viewModelImage() }"></a>

                    <div class="swiper-container" id="altImages">
                        <div class="swiper-wrapper">
                            <!-- ko foreach: $parent.viewModelAltImg() -->
                                <div class="swiper-slide" style="width: auto; margin-right: 12px;">
                                    <a data-bind="event: { click: $parent.swapMainImage.bind($parent) }">
                                        <img data-bind="attr:{ src: $data, alt: $parent.params.parent.viewModelTitle()+' thumbnail' }, swpierInit"></img>
                                    </a>
                                </div>
                            <!-- /ko -->
                        </div>
                        <div class="swiper-button-prev"><span class="icon-caret_left icon-lg"></span></div>
                        <div class="swiper-button-next"><span class="icon-caret_right icon-lg"></span></div>
                    </div>
                </div>

                <div class="small-12 medium-5 text-center columns copy">
                    <div class="row">
                        <!-- <div class="small-12 columns" id="quickViewVotingContainer">
                            <div class="votingContainer">
                                <a data-bind="event: { click: quickViewDownVote.bind($data) }"><img class="voteBtns downVote" src="/images/SUN-thumb_boo.png"></a>
                                <a data-bind="event: { click: quickViewUpVote.bind($data) }"><img class="voteBtns upVote" src="/images/SUN-thumb_yay.png"></a>
                            </div>
                        </div> -->

                        <div class="small-12 columns">
                            <h1 data-bind="text: $parent.viewModelTitle()"></h1>
                        </div>
                        <div class="small-12 columns">
                            <div class="intro-text itemDescription" data-bind="html: $parent.viewModelTagLine()"></div>
                        </div>
                        <div class="small-12 columns">
                            <p class="item-price price">
                                <span data-bind="text: $parent.viewModelPrice()"></span>
                            </p>
                        </div>
                        <div class="small-12 columns">
                            <div class="avgRating">
                                <span data-bind="attr: { class: 'fontStars-'+ $parent.viewModelAvgRating() }"></span><span class="body-mini">(<span data-bind="text: $parent.viewModelNumberOfReviews() != '' ? $parent.viewModelNumberOfReviews() : ''"></span>)</span>
                            </div>
                        </div>
                        <div class="small-12 columns">
                            <div class="row selectQuanity">
                                <!-- ko if: $parent.viewModelMultiSku().length <= 1 -->
                                    <div class="small-4 columns">
                                        <select data-bind="options: itemQuantity()"></select>
                                    </div>

                                    <div class="small-8 columns">
                                        <a data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }"><input type="button" value="add to cart" class="urgent expand"></a>
                                    </div>
                                <!-- /ko -->

                                <!-- ko if: $parent.viewModelMultiSku().length > 1 -->
                                    <div class="small-8 columns">
                                        <select data-bind="options: $parent.viewModelMultiSku()"></select>
                                    </div>

                                    <div class="small-4 columns">
                                        <select data-bind="options: itemQuantity()"></select>
                                    </div>

                                    <div class="small-12 columns">
                                        <a data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }"><input type="button" value="add to cart" class="urgent expand"></a>
                                    </div>
                                <!-- /ko -->

                                <div class="small-12 columns">
                                    <a class="body-small a-tertiary" data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }">view full details</a>
                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>`, synchronous: true
});

ko.components.register('products', {
    viewModel: class ProductsComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.itemId = ko.observable(params.data.itemId);
            this.title = ko.observable(params.data.title);
            this.price = ko.observable(params.data.price);
            this.productURL = ko.observable(ugWeb+'/product/'+params.data.itemURL);
            this.imageURL = ko.observable(ugWeb + params.data.imageURL);
            this.numberOfReviews = ko.observable(params.data.noOfReviews);
            this.rating = ko.observable(params.data.rating.toString().replace('.','_'));
            this.displayUpVoteSelected = ko.observable(false);
            this.isTryDownVoteingProTip = ko.observable(false);
            this.displayDownVoteSelected = ko.observable(false);
            this.displayBorderSelected = function() {
                if (this.displayDownVoteSelected()) {
                    return 'downvotedBorder'
                } else if (this.displayUpVoteSelected()) {
                    return 'upvotedBorder'
                } else {
                    return ''
                }
            };
            this.downVote = function() {
                // console.log('down vote',this);
                this.displayDownVoteSelected(true);
                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.isItemDownvoted(true);
            }
            this.downVoteReasonSelection = function() {
                this.displayDownVoteSelected(false);
                // console.log('down vote reason selected ',this.params.parent.searchResults()[0]);
                this.imageURL(ugWeb + this.params.parent.searchResults()[0].imageURL);
                this.title(this.params.parent.searchResults()[0].title);
                this.price(this.params.parent.searchResults()[0].price);
                this.itemId(this.params.parent.searchResults()[0].itemId);
                this.numberOfReviews(this.params.parent.searchResults()[0].noOfReviews);
                this.rating(this.params.parent.searchResults()[0].rating.toString().replace('.','_'));
                this.productURL(ugWeb+'/product/'+this.params.parent.searchResults()[0].itemURL);
                this.params.parent.searchResults.splice(0,1);
                this.isloading(true);
                var self = this;
                var upperCaseName = ko.computed(function() {
                    setTimeout(function(){ self.isloading(false); }, 1000);
                });
                return true;
            }
            this.upVote = function() {
                // console.log('up vote ',this);
                this.params.parent.totalGiftIdeas(this.params.parent.searchResultsTotal());
                this.params.parent.isDisplayGate(false);
                if (!this.displayUpVoteSelected()) {
                    this.params.parent.isAllowedMoreItems(true);
                    this.params.parent.upvoteCounter() === 0 ? this.params.parent.isProTip(true) : '';
                    this.params.parent.upvoteCounter() != 3 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                    this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? this.isTryDownVoteingProTip(true) : this.isTryDownVoteingProTip(false);
                    this.params.parent.upVotedResults.push(this);
                    this.displayUpVoteSelected(true);
                }
                if (this.params.parent.upvoteCounter() === 1) {
                    this.params.parent.addItems(24);
                }
            }
            this.closeProTipTryDownVoting = function() {
                this.isTryDownVoteingProTip(false);
            }
            this.displayQuickView = function(product) {
                this.params.parent.viewModelImage(this.imageURL().split('360px')[0]+'640px.jpg');
                this.params.parent.viewModelTitle(this.title());
                this.params.parent.viewModelPrice(this.price());
                this.params.parent.viewModelItemId(this.itemId());
                this.params.parent.viewModelNumberOfReviews(this.numberOfReviews());
                this.params.parent.viewModelAvgRating(this.rating());
                this.params.parent.viewModelProductURL(this.productURL());
                this.params.parent.productParent(this);
                //this.displayUpVoteSelected() ? document.getElementById('quickViewVotingContainer').style.display = 'none' : document.getElementById('quickViewVotingContainer').style.display = 'block'
                var self = this;
            	$.getJSON( "http://www.uncommongoods.com/assets/get/item/"+this.params.parent.viewModelItemId(), function( itemdata ) {
                    self.params.parent.viewModelTagLine(itemdata[0].metaDescr);
                    self.params.parent.viewModelAltImg([]);
                    self.params.parent.viewModelMultiSku([]);

                    var itemDir = '//www.uncommongoods.com/images/items/';
                    var itemId = itemdata[0].itemId;
                    var itemIdTrim = itemId.toString().slice(0, -2);

                    itemdata[0].itemMedia.forEach((mediaType, index) => {
                        mediaType.mediaTypeId === 1 ? self.params.parent.viewModelAltImg.push(itemDir+itemIdTrim+'00/'+itemId+'_'+(index+1)+'_64px.jpg') : '';
                    })


                    if (itemdata[0].skus.length > 1) {
                        itemdata[0].skus.forEach((sku, index) => {
                            sku.status === 'live' ? self.params.parent.viewModelMultiSku.push(sku.color + ' $'+sku.price) : '';
                        })
                    }
            	})
            }
            this.isloading = ko.observable(false);
            this.exitDownVoteReason = function() {
                this.displayDownVoteSelected(false);
            }
        }
    },
    template: `
        <article class="product" data-bind="attr: { id: itemId() }">
            <div class="responsively-lazy preventReflow">
                <!-- ko if: !displayUpVoteSelected() && !displayDownVoteSelected() -->
                    <a data-bind="event:{ click: downVote.bind($data) }"><span class="icon-close icon-md"></span></a>
                <!-- /ko -->

                <a data-reveal-id="sunnyQuickViewModal" data-bind="event: { click: displayQuickView.bind($data) }"><img data-bind="attr: { src: imageURL(), class: displayBorderSelected() }"></a>




                    <div data-bind="attr: { class: displayDownVoteSelected() ? 'downVoteReasonContainer border' : 'downVoteReasonContainer' }">
                        <div data-bind="attr: { class: displayDownVoteSelected() ? 'downVoteReason slideUp' : 'downVoteReason' }">
                            <ul>
                                <li>
                                    <input type="radio" data-bind="attr:{ 'name': 'downVoteReason1_'+ itemId(), 'id': 'downVoteReason1_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }">
                                    <label data-bind="attr:{ for: 'downVoteReason1_'+ itemId() }">I don't like this item</label>
                                </li>
                                <li>
                                    <input type="radio" data-bind="attr:{ 'name': 'downVoteReason2_'+ itemId(), 'id': 'downVoteReason2_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }">
                                    <label data-bind="attr:{ for: 'downVoteReason2_'+ itemId() }">I don't like this style</label>
                                </li>
                                <li>
                                    <input type="radio" data-bind="attr:{ 'name': 'downVoteReason3_'+ itemId(), 'id': 'downVoteReason3_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }">
                                    <label data-bind="attr:{ for: 'downVoteReason3_'+ itemId() }">Don't show me kitchen & bar</label>
                                </li>
                                <li>
                                    <input type="radio" data-bind="attr:{ 'name': 'downVoteReason4_'+ itemId(), 'id': 'downVoteReason4_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }">
                                    <label data-bind="attr:{ for: 'downVoteReason4_'+ itemId() }">Don't show me dishware</label>
                                </li>
                                <li>
                                    <input type="radio" data-bind="attr:{ 'name': 'downVoteReason5_'+ itemId(), 'id': 'downVoteReason5_'+itemId() }, event:{ click: downVoteReasonSelection.bind($data) }">
                                    <label data-bind="attr:{ for: 'downVoteReason5_'+ itemId() }">Other reason</label>
                                </li>
                            </ul>

                            <a data-bind="event:{ click: exitDownVoteReason.bind($data) }" class="exitDownVoteReason">
                                <span class="icon-caret_down icon-md right"></span>
                            </a>
                        </div>
                    </div>




                <div data-bind="attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'votingContainer text-center upvoted' : 'votingContainer text-center' }">
                    <!-- ko if: !displayDownVoteSelected() -->
                        <div data-bind="attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'innerCircle outterCircle upvoted' : 'outterCircle' }">
                            <div data-bind="attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'innerCircle upvoted' : 'innerCircle' }">
                                <a data-bind="event:{ click: upVote.bind($data) }"><span class="icon-star"></span></a>
                            </div>
                        </div>
                    <!-- /ko -->
                </div>

                <!-- ko if: isloading() -->
                    <div class="loadingSvg">
                        <embed type="image/svg+xml" src="/images/frame/loader.svg" style="width:3rem">
                    </div>
                <!-- /ko -->

            </div>

            <div data-bind="attr: { class: displayUpVoteSelected() ? 'copy borderAdded upvoted' : displayDownVoteSelected() ? 'copy borderAdded downvoted' : 'copy' }">
                <h4>
                    <a class="a-secondary" data-bind="attr: { href: productURL() }">
                    <span data-bind="text: title()"></span></a>
                </h4>
                <p class="body-small price" data-bind="text: price()"></p>
                <div data-bind="attr: { class: isTryDownVoteingProTip() ? 'tryDownVoteingProTip animateDown' : 'tryDownVoteingProTip' }">
                    <div>
                        <a data-bind="event:{ click: closeProTipTryDownVoting.bind($data) }">
                            <span class="icon-close icon-sm right"></span>
                        </a>
                    </div>
                    <p class="intro-text">Thumbs down what you don’t like so we can find better suggestions</p>
                </div>
            </div>
        </article>`, synchronous: true
});

ko.components.register('sunny-results-container', {
    viewModel: class sunnyResultsComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.searchResults = ko.observableArray([]).extend({ deferred: true });
            this.totalGiftIdeas = ko.observable(18);
            this.searchResultsTotal = ko.observable();
            this.displaySearchResults = ko.observableArray([]);
            this.displaySearchResultsTemp = ko.observableArray([]);
            this.isInitItemsLoaded = false;
            this.isLikeMoreItemsCopy = ko.observable(false);
            this.closeProTip = function() {
                // console.log('closeProTip ',this);
                this.isProTip(false);
            }
            this.addItems = function(load) {
                this.displaySearchResultsTemp.removeAll();
                var itemsToAdd = load;

                while (itemsToAdd--) {
                    if (this.searchResults()[itemsToAdd]) {
                        this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                        this.searchResults.splice(itemsToAdd, 1);
                    }
                }
                this.displaySearchResultsTemp.reverse();
                this.displaySearchResultsTemp().forEach((product, index) => {
                    this.displaySearchResults.push(product);
                })

            }
            this.viewSavedItems = function() {
                // console.log('viewSavedResults ',this);
                if (this.upVotedResults().length > 0) {
                    this.displayUpVotedResults() ? (this.displayUpVotedResults(false), this.displaySearchResultsToggle(true)) : (this.displayUpVotedResults(true), this.displaySearchResultsToggle(false));
                }
            }
            this.isDisplayGate = ko.observable(true);
            self = this;
            $.getJSON( "/js/coffee_search_results.json", function(data) {
                data.products.forEach((product,index) => {
                    self.searchResults.push(product);
                })
                self.searchResultsTotal(data.products.length);
            })

            ko.bindingHandlers.scroll = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    window.onbeforeunload = function () {
                        window.scrollTo(0, 0);
                    }
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    if (self.searchResults().length != 0 && !self.isInitItemsLoaded) {
                        viewModel.addItems(18);
                        viewModel.totalGiftIdeas(18);
                        self.isInitItemsLoaded = true;
                    }

                    if (self.isInitItemsLoaded) {
                        $(window).on("scroll.ko.scrollHandler", function () {
                            if(($(document).height() <= $(window).height() + $(window).scrollTop())) {
                                if (self.isAllowedMoreItems()) {
                                    viewModel.addItems(18);
                                } else {
                                    likeMoreItems();
                                }
                            }
                        })
                    }

                    function likeMoreItems() {
                        // console.log('Try liking a few to see more ideas!');
                        // bounce animated
                        $.fn.extend({
                            animateCss: function (animationName) {
                                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                                this.addClass('animated ' + animationName).one(animationEnd, function() {
                                    $(this).removeClass('animated ' + animationName);
                                });
                            }
                        });
                        $('#sunnyResults').animateCss('bounce');
                        $(document).ready(function() {
                            if (!self.isLikeMoreItemsCopy()) {
                                $("<p class='call-out-large'>").text("Try liking a few to see more ideas!").appendTo("#likeMoreIdeas");
                                self.isLikeMoreItemsCopy(true);
                            }
                        });
                    }
                }
            }
        }
    },
    template: `
        <div class="sunnyResultsContainer">
            <!-- Fixed Header -->
            <div class="row sunnyResultsHeader">
                <div class="small-12 columns">
                    <div class="contain-to-grid fixed">
                        <div class="row">
                            <div class="small-12 large-10 xlarge-8 columns small-centered">
                                <div class="row">
                                    <div class="small-12 columns">
                                        <div class="flexContainer">
                                            <span class="icon-caret_double_left icon-md"></span>
                                            <div class="logo-container">
                                                <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="600" height="91" version="1.1" viewBox="-5 0 610 91"><g transform="translate(0,-961.36215)"><g transform="matrix(0.88125356,0,0,0.88125356,-1.1665022,959.21629)"><path d="m48 73.9c0.1-7.7 0.3-34.8-0.1-37.5-1.4-1.1-8.2-1-9.7 0-0.5 3.5-0.5 21.6-0.6 30.8-2.2 3.6-8.4 6-13.4 6-2.7 0-5.5-1.7-5.5-5.7 0-2.6 0.5-25.3 0.3-27.4-0.3-3-2.2-4.5-7.9-4.5-5 0-8.2 1.7-8.2 4.5v3.8H9.3C8.9 51.2 8.4 66.8 9.2 71.4c1.2 7.1 5.7 11.7 12.8 11.7 6.2 0 14-3.2 16.4-7.3 0.1 0 0.3 0 0.3 0-0.2 0.5-0.3 1.3-0.3 2.2 0 3 2 4.5 7.6 4.5 5 0 8.2-2.3 8.2-5.1v-3.5h-6.2zM61.3 43.8 61.3 43.8 61.3 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5C99 39.2 94.5 34.6 87.4 34.6c-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1l0 3.5h6.2z" class="logo-blue" "#387d9b"=""></path><path d="M7.2 13.5C5.1 11.4 3.6 12.1 2.4 13.3c-1.2 1.2-1.7 2.9 0.2 4.8 1.6 1.6 8 6.3 11 7.7 0.8 0.4 1.8-0.5 1.4-1.3-1.4-2.9-6.2-9.5-7.7-11zM51.7 13.3 51.7 13.3 51.7 13.3c-1.2-1.2-2.7-1.9-4.8 0.2-1.6 1.6-6.4 8.1-7.7 11-0.4 0.8 0.6 1.7 1.4 1.3 2.9-1.4 9.4-6.1 11-7.7 1.9-1.9 1.4-3.6 0.2-4.8zM27 2.7c-1.7 0-3.3 0.8-3.3 3.6 0 2.2 1.2 16.2 2.3 19.2 0.3 0.9 1.6 0.9 1.9 0.1 1.1-3 2.3-17.1 2.3-19.3 0-3-1.6-3.6-3.3-3.6z" class="logo-green"></path><path d="m194.1 58.5c0-20.7-10.7-23.9-22-23.9-11.3 0-22 4.9-22 23.9 0 19 10.7 23.9 22 23.9 11.3 0 22-3.2 22-23.9zm-22 15.8c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 6 0 11.7 2.1 11.7 16 0 14.2-5.7 15.8-11.7 15.8zM384.2 58.5 384.2 58.5 384.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM391.6 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2zM334.5 73.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0.1c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0-2-4.6-6-7.3-11.5-7.3-6.2 0-13.7 3.2-16.1 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.1-6.9 13.1-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-5.9 0.7-17.2 0.4-23.8 2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-6 0.7-17.4 0.4-23.9l0 0.2c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.3-5.9 0.7-17.3 0.4-23.8l0 0.1c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8zM143.6 71.8c-2.4 1.2-9.6 2.2-12.9 2.2-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 2.2 0 4.2 0.3 5.8 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.5h0c0-4.1-4.4-7.6-15.1-7.6-11.3 0-23 4.9-23 23.9 0 19 10.7 23.9 22 23.9 5.7 0 12.4-1.7 15-3.4 2.4-1.6 0-6.8-2.2-6.8z" class="logo-blue"></path><path d="m538.4 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zM514.9 75.1c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM589.2 58.5 589.2 58.5 589.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM682.2 68.5c0-15.3-24.6-14-24.6-21.9 0-3.9 1.6-5.7 7.7-5.7 2.2 0 3.9 0.3 5.5 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.4l0 0c0-4.1-4.1-7.6-14.8-7.6-11.3 0-18.5 3.9-18.5 14.5 0 14.4 24.4 12.8 24.4 21 0 3.8-1.5 5.6-7.5 5.6-3.6 0-5.6-0.5-7-1.4 0-7.5-1.7-8.2-4.5-8.2h-1.2c-3 0-4.5 1.2-4.5 9.5l0 0c0 4.1 5.6 7.9 16.3 7.9 11.3 0 18.5-2.6 18.5-13.5zM490.1 40.2c0-2.8-3.3-5.1-8.2-5.1-4.8 0-7 1.1-7.5 3.3-3.1-2.4-7.3-4-12-4-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.7 0 7.7-1.1 10.9-2.7 0 1.6 0 2.5 0 2.5 0 13.9-6 15.7-12 15.7-3.3 0-10.5-1-12.9-2.2-2.2 0.1-4.5 5.3-2.2 6.8 2.7 1.8 9.3 3.4 15 3.4 11.3 0 22.3-4.9 22.3-23.9 0 0 0-30.5-0.1-38.2h6.2l0-3.5zm-27.3 33.7c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.7 0 9.2 2.7 10.9 6.7l-0.1 1.5c0 4.9 0 13.6 0.1 20.6-3.4 2.1-8.1 3-10.8 3zM643.8 73.6h-6.4c0.3-5 0.6-13.9 0.5-20.5 0.3-6.8 0.3-19.7 0.3-27 0-3.6 0-8.8-0.6-10.7-0.9-2.8-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c0 3.5-0.1 11.1-0.1 18.5-3-2.2-7.1-3.7-11.6-3.7-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.4 0 7.7-1.5 11-4.2 0.5 2.7 2.5 4 7.9 4 5 0 8.2-1.7 8.2-4.5l0-3.8zm-27.1 0.3c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.9 0 9.7 3 11.1 7.4 0 1 0 1.9 0 2.7-0.1 3.7-0.2 10.8-0.2 16.5-3.1 3.5-6.5 5.2-10.9 5.2z" class="logo-green headerLogo"></path></g></g></svg>
                                            </div>
                                            <a class="wishlistIcon"><span class="icon-heart_small icon-sm GAWishList"></span> Wish Lists</a>
                                            <span class="signInIcon"><span class="icon-account icon-sm"></span><span class="accountCopy">Hi, Microhyls</span></span>
                                            <span class="icon-caret_down icon-md"></span>
                                            <span class="icon-cart icon-md"></span>
                                            <span class="checkoutCopy">Checkout</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="small-12 large-10 xlarge-8 columns small-centered">
                                <div class="top-bar">
                                    <div class="left flexContainer">


                                        <h1 data-bind="text: 'gift ideas (' + totalGiftIdeas() + ')' "></h1>



                                    </div>
                                    <div class="right flexContainer">
                                        <!-- ko if: upVotedResults().length > 0 && !displayUpVotedResults() -->
                                            <span class="upVotedResultsCounter" data-bind="text: upVotedResults().length"></span>
                                        <!-- /ko -->
                                        <!-- ko if: !displayUpVotedResults() -->
                                            <i aria-hidden="true" data-bind="attr: { class: upVotedResults().length > 0 ? 'icon-gift icon-sm' : 'fa fa-thumbs-up fa-2' }"></i>
                                        <!-- /ko -->

                                        <div class="proTip">
                                            <label>
                                                <a class="a-secondary" data-bind="text: toggleSavedText(), attr: { href: upVotedResults().length > 0 ? 'upvote' : '' }, event: { click: viewSavedItems.bind($data) }"></a>
                                            </label>
                                             <!-- ko if: isProTip() -->
                                             <div id="firstUpVoteProTip" class="proTipText">
                                                 <div class="closeProTip">
                                                     <a data-bind="event:{ click: closeProTip.bind($data) }">
                                                         <span class="icon-close icon-sm right"></span>
                                                     </a>
                                                 </div>
                                                 <div class="copy">
                                                     <p class="intro-text">
                                                        You can see all the items you like right here. Handy, right?
                                                     </p>
                                                 </div>
                                             </div>
                                             <!-- /ko -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Results -->
            <div id="sunnyResults" class="row fullwidth" data-bind="scroll, visible: displaySearchResultsToggle()">
                <div class="small-12 large-11 xlarge-8 small-centered columns sunnySearchResults">
                    <ul class="small-block-grid-2 medium-block-grid-3 end" data-bind="foreach: displaySearchResults()">
                        <li data-bind='component: { name: "products", params: { data: $data, parent: $parent } }'></li>
                    </ul>

                    <div class="row">
                        <div class="small-12 columns">
                            <div class="row">
                                <div class="small-12 columns">
                                    <div class="row collapse">
                                        <div class="small-8 medium-10 large-8 small-centered columns">
                                            <hr class="dottedSpacer">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ko if: isDisplayGate() -->
                            <div id="likeMoreIdeas" class="small-12 text-center columns"></div>
                        <!-- /ko -->
                    </div>
                </div>
            </div>
            <!-- Search Results End-->

            <!-- ko if: displayUpVotedResults() -->
                <!-- ko component: {name: 'upvoted-results', params: { parent: $data } } --><!-- /ko -->
            <!-- /ko -->

            <!-- ko component: {name: 'quickview', params: { parent: $data } } --><!-- /ko -->
        </div>`, synchronous: true
});

ko.applyBindings();
