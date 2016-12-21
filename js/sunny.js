const ugWeb = '//www.uncommongoods.com';

class Dependents {
    constructor(params) {
        this.isAllowedMoreItems = ko.observable(false);
        this.isProTip = ko.observable(false);
        this.upvoteCounter = ko.observable(0);
        this.isItemDownvoted = ko.observable(false);

        this.viewModelImage = ko.observable('');
        this.viewModelTitle = ko.observable('');
        this.viewModelPrice = ko.observable('');
        this.viewModelTagLine = ko.observable('');
        this.viewModelAvgRating = ko.observable('');
        this.viewModelNumberOfReviews = ko.observable('');
        this.viewModelProductURL = ko.observable('');
        this.itemQuantity = ko.observableArray([0,1,2,3,4,5,6,7,8,9,10]);
        this.productParent = ko.observable();

        this.upVotedResults = ko.observableArray([]);
        this.displayUpVotedResults = ko.observable(false);


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
                        element.innerHTML = itemdata[0].tagLine;
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
                                <a data-bind=""><img data-bind="attr: { src: ugWeb + $data.imageURL }"></a>
                            </div>
                            <div class="small-6 text-center columns">
                                <h1 data-bind="html: $data.title"></h1>
                                <div class="intro-text itemDescription" data-bind="getItemDescription: $data.itemId"></div>
                                <p class="item-price price">
                                    <span data-bind="html: $data.price"></span>
                                </p>
                                <div class="avgRating">
                                    <span data-bind="attr: { class: 'fontStars-'+ $data.rating.toString().replace('.','_') }"></span><span class="body-mini">(<span data-bind="html: $data.noOfReviews != '' ? $data.noOfReviews : '0'"></span>)</span>
                                </div>
                            </div>

                            <div class="small-6 columns">
                                <div class="row selectQuanity">
                                    <div class="small-3 columns">
                                        <select data-bind="options: $parent.itemQuantity()"></select>
                                    </div>
                                    <div class="small-9 columns">
                                        <a data-bind="attr: { href: ugWeb+'/product/'+$data.itemURL, target: '_blank' }"><input type="button" value="add to cart" class="urgent expand"></a>
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
                parentProduct.displayDownVoteSelected(true);
                parentProduct.isAllowedMoreItems(true);
                parentProduct.isItemDownvoted(true);
                $('#giftBotQuickViewModal').foundation('reveal', 'close');
            }
            this.quickViewUpVote = function() {
                var parentProduct = this.params.parent.productParent();
                parentProduct.displayUpVoteSelected(true);
                parentProduct.isAllowedMoreItems(true);
                this.params.parent.upvoteCounter() === 0 ? this.params.parent.isProTip(true) : '';
                this.params.parent.upvoteCounter() != 2 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? parentProduct.isTryDownVoteingProTip(true) : parentProduct.isTryDownVoteingProTip(false);
                $('#giftBotQuickViewModal').foundation('reveal', 'close');
            }
        }
    },
    template: `
        <div id="giftBotQuickViewModal" class="reveal-modal" data-reveal="" aria-hidden="true" role="dialog" style="max-width: 60%;">
            <div class="row" style="max-width: 100%;">
                <div class="small-12 medium-6 columns">
                    <a data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }"><img data-bind="attr: { src: $parent.viewModelImage() }"></a>
                </div>
                <div class="small-12 medium-6 text-center columns">
                    <div class="row">
                        <div class="small-12 columns">
                            <div class="votingContainer">
                                <a data-bind="event: { click: quickViewDownVote.bind($data) }"><img class="voteBtns downVote" src="/images/SUN-thumb_boo.png"></a>
                                <a data-bind="event: { click: quickViewUpVote.bind($data) }"><img class="voteBtns upVote" src="/images/SUN-thumb_yay.png"></a>
                            </div>
                        </div>
                        <div class="small-12 columns">
                            <h1 data-bind="html: $parent.viewModelTitle()"></h1>
                        </div>
                        <div class="small-12 columns">
                            <div class="intro-text itemDescription" data-bind="html: $parent.viewModelTagLine()"></div>
                        </div>
                        <div class="small-12 columns">
                            <p class="item-price price">
                                <span data-bind="html: $parent.viewModelPrice()"></span>
                            </p>
                        </div>
                        <div class="small-12 columns">
                            <div class="avgRating">
                                <span data-bind="attr: { class: 'fontStars-'+ $parent.viewModelAvgRating() }"></span><span class="body-mini">(<span data-bind="html: $parent.viewModelNumberOfReviews() != '' ? $parent.viewModelNumberOfReviews() : ''"></span>)</span>
                            </div>
                        </div>
                        <div class="small-12 columns">
                            <div class="row selectQuanity">
                                <div class="small-3 columns">
                                    <select data-bind="options: itemQuantity()"></select>
                                </div>
                                <div class="small-9 columns">
                                    <a data-bind="attr: { href: $parent.viewModelProductURL(), target: '_blank' }"><input type="button" value="add to cart" class="urgent expand"></a>
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
            this.productURL = params.data.categoryURL;
            this.imageURL = ugWeb + params.data.imageURL;
            this.title = params.data.title;
            this.price = params.data.price;
            this.itemId = params.data.itemId;

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
                console.log('down vote',this);
                this.displayDownVoteSelected(true);
                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.isItemDownvoted(true);
            }
            this.downVoteReasonSelection = function() {
                console.log('radio btn selected ');
                this.displayDownVoteSelected(false);
                return true;
            }
            this.upVote = function() {
                console.log('up vote ',this);
                this.displayUpVoteSelected(true);
                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.upvoteCounter() === 0 ? this.params.parent.isProTip(true) : '';
                this.params.parent.upvoteCounter() != 2 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? this.isTryDownVoteingProTip(true) : this.isTryDownVoteingProTip(false);
                this.params.parent.upVotedResults.push(this.params.data);
            }
            this.closeProTipTryDownVoting = function() {
                this.isTryDownVoteingProTip(false);
            }
            this.displayQuickView = function() {
                this.params.parent.productParent(this);
                var itemID = this.params.data.itemId;
                this.params.parent.viewModelImage(ugWeb+this.params.data.imageURL);
                this.params.parent.viewModelTitle(this.params.data.title);
                this.params.parent.viewModelPrice(this.params.data.price);
                this.params.parent.viewModelAvgRating(this.params.data.rating.toString().replace('.','_'));
                this.params.parent.viewModelNumberOfReviews(this.params.data.noOfReviews);
                this.params.parent.viewModelProductURL(ugWeb+'/product/'+ this.params.data.itemURL);

                var self = this;
            	$.getJSON( "http://www.uncommongoods.com/assets/get/item/"+itemID, function( itemdata ) {
                    self.params.parent.viewModelTagLine(itemdata[0].tagLine);
            	})
            }
        }
    },
    template: `
        <article class="product" data-bind="attr: { id: itemId }">
            <div class="responsively-lazy preventReflow">
                <a data-reveal-id="giftBotQuickViewModal" data-bind="event: { click: displayQuickView.bind($data) }"><img data-bind="attr: { src: imageURL, class: displayBorderSelected() }"></a>
                <!-- ko if: displayDownVoteSelected() -->
                    <div class="downVoteReason">
                        <div class="small-12 columns">
                            <input type="radio" data-bind="attr:{ 'name': 'downVoteReason1_'+ itemId, 'id': 'downVoteReason1_'+itemId }, event:{ click: downVoteReasonSelection.bind($data) }">
                            <label data-bind="attr:{ for: 'downVoteReason1_'+ itemId }">I dont't like this item</label>
                        </div>
                        <div class="small-12 columns">
                            <input type="radio" data-bind="attr:{ 'name': 'downVoteReason2_'+ itemId, 'id': 'downVoteReason2_'+itemId }, event:{ click: downVoteReasonSelection.bind($data) }">
                            <label data-bind="attr:{ for: 'downVoteReason2_'+ itemId }">I don't like this style</label>
                        </div>
                        <div class="small-12 columns">
                            <input type="radio" data-bind="attr:{ 'name': 'downVoteReason3_'+ itemId, 'id': 'downVoteReason3_'+itemId }, event:{ click: downVoteReasonSelection.bind($data) }">
                            <label data-bind="attr:{ for: 'downVoteReason3_'+ itemId }">Don't show me kitchen & bar</label>
                        </div>
                        <div class="small-12 columns">
                            <input type="radio" data-bind="attr:{ 'name': 'downVoteReason4_'+ itemId, 'id': 'downVoteReason4_'+itemId }, event:{ click: downVoteReasonSelection.bind($data) }">
                            <label data-bind="attr:{ for: 'downVoteReason4_'+ itemId }">Don't show me dishware</label>
                        </div>
                        <div class="small-12 columns">
                            <input type="radio" data-bind="attr:{ 'name': 'downVoteReason5_'+ itemId, 'id': 'downVoteReason5_'+itemId }, event:{ click: downVoteReasonSelection.bind($data) }">
                            <label data-bind="attr:{ for: 'downVoteReason5_'+ itemId }">Other reason</label>
                        </div>
                    </div>
                <!-- /ko -->
                <div data-bind="attr: { class: displayDownVoteSelected() || displayUpVoteSelected() ? 'votingContainer text-center animateUp' : 'votingContainer text-center animateDown' }">
                    <!-- ko if: !displayUpVoteSelected() -->
                        <a data-bind="event:{ click: downVote.bind($data) }"><img class="voteBtns downVote" src="/images/SUN-thumb_boo.png"></a>
                    <!-- /ko -->

                    <!-- ko if: !displayDownVoteSelected() -->
                        <a data-bind="event:{ click: upVote.bind($data) }"><img class="voteBtns upVote" src="/images/SUN-thumb_yay.png"></a>
                    <!-- /ko -->
                </div>
            </div>
            <div class="copy">
                <h4>
                    <a class="a-secondary" data-bind="attr: { href: productURL }">
                    <span data-bind="html: title"></span></a>
                </h4>
                <p class="body-small price" data-bind="html: price"></p>
                <div data-bind="attr: { class: isTryDownVoteingProTip() ? 'tryDownVoteingProTip animateDown' : 'tryDownVoteingProTip' }">
                    <div>
                        <a data-bind="event:{ click: closeProTipTryDownVoting.bind($data) }">
                            <span class="icon-close icon-sm right"></span>
                        </a>
                    </div>
                    <p>Pro Tip:</p>
                    <p class="intro-text">Try down voting a few items you're not interested in... it will give you better results</p>
                </div>
            </div>
        </article>`, synchronous: true
});

ko.components.register('gift-bot-results-container', {
    viewModel: class GiftbotResultsComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.searchResults = ko.observableArray([]).extend({ deferred: true });
            this.displaySearchResults = ko.observableArray([]);
            this.displaySearchResultsTemp = ko.observableArray([]);
            this.curr = ko.observable(24);
            this.old = ko.observable(0);
            this.isInitItemsLoaded = false;
            this.isLikeMOreItemsCopy = ko.observable(false);
            this.closeProTip = function() {
                console.log('closeProTip ',this);
                this.isProTip(false);
            }
            this.addItems = function(load) {
                this.displaySearchResultsTemp.removeAll();
                var itemsToAdd = load;

                while (itemsToAdd--) {
                    this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                    this.searchResults().splice(itemsToAdd, 1);
                }
                this.displaySearchResultsTemp.reverse();

                this.displaySearchResultsTemp().forEach((product, index) => {
                    this.displaySearchResults.push(product);
                })

            }
            this.viewSavedItems = function() {
                console.log('viewSavedItems ',this);
                this.displayUpVotedResults() ? this.displayUpVotedResults(false) : this.displayUpVotedResults(true);
            }
            self = this;
            $.getJSON( "http://localhost:3000/js/gifts_search_results.json", function(data) {
                data.products.forEach((product,index) => {
                    self.searchResults.push(product);
                })
                // console.log(self.searchResults());
                // console.log(self.searchResults().length);
            })

            ko.bindingHandlers.scroll = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    window.onbeforeunload = function () {
                        window.scrollTo(0, 0);
                    }
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    if (self.searchResults().length != 0 && !self.isInitItemsLoaded) {
                        viewModel.addItems(24);
                        self.isInitItemsLoaded = true;
                    }

                    if (self.isInitItemsLoaded) {
                        $(window).on("scroll.ko.scrollHandler", function () {
                            if(($(document).height() <= $(window).height() + $(window).scrollTop())) {
                                if (self.isAllowedMoreItems()) {
                                    viewModel.addItems(24);
                                } else {
                                    likeMoreItems();
                                }
                            }
                        })
                    }

                    function likeMoreItems() {
                        console.log('Try liking a few to see more ideas!');
                        // bounce animated
                        $.fn.extend({
                            animateCss: function (animationName) {
                                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                                this.addClass('animated ' + animationName).one(animationEnd, function() {
                                    $(this).removeClass('animated ' + animationName);
                                });
                            }
                        });
                        $('#giftBotResults').animateCss('bounce');
                        $(document).ready(function() {
                            if (!self.isLikeMOreItemsCopy()) {
                                $("<p class='call-out-large'>").text("Try liking a few to see more idea!").appendTo("#likeMoreIdeas");
                                self.isLikeMOreItemsCopy(true);
                            }
                        });
                    }
                }
            }
        }
    },
    template: `
        <div class="giftBotResultsContainer">
            <!-- Fixed Header -->
            <div class="row giftBotResultsHeader">
                <div class="small-12 columns">
                    <div class="contain-to-grid fixed">
                        <nav class="top-bar" data-topbar role="navigation">
                            <ul class="title-area">
                                <li class="left">
                                  <h1>gift shopping for neighbor</h1>
                                </li>
                                <li class="right">

                                   <i class="fa fa-thumbs-up fa-2" aria-hidden="true"></i>

                                   <label class="proTip">
                                        <a data-bind="event: { click: viewSavedItems.bind($data) }">Like to save gift ideas</a>
                                        <!-- ko if: isProTip() -->
                                            <div id="firstUpVoteProTip" class="proTipText">
                                                <div class="closeProTip">
                                                    <a data-bind="event:{ click: closeProTip.bind($data) }">
                                                        <span class="icon-close icon-sm right"></span>
                                                    </a>
                                                </div>
                                                <div class="copy">
                                                    <p>Pro Tip:</p>
                                                    <p class="intro-text">
                                                        The items you like will get saved in a list that you can view right here. Handy, right?
                                                    </p>
                                                </div>
                                            </div>
                                        <!-- /ko -->
                                   </label>

                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>


            <!-- Search Results -->

            <!-- ko if: !displayUpVotedResults() -->
                <div id="giftBotResults" class="row fullwidth" data-bind="scroll">
                    <div class="small-12 small-centered columns giftBotSearchResults">
                        <ul class="small-block-grid-1 medium-block-grid-3 end" data-bind="foreach: displaySearchResults()">
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
                            <div id="likeMoreIdeas" class="small-12 text-center columns"></div>
                        </div>
                    </div>
                </div>
            <!-- /ko -->

            <!-- ko if: displayUpVotedResults() -->
                <!-- ko component: {name: 'upvoted-results', params: { parent: $data } } --><!-- /ko -->
            <!-- /ko -->


            <!-- ko component: {name: 'quickview', params: { parent: $data } } --><!-- /ko -->
        </div>`, synchronous: true
});

ko.applyBindings();
