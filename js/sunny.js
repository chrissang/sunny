const ugWeb = '//www.uncommongoods.com';

// var upvoteCounter = 0;


class Dependents {
    constructor(params) {
        this.isAllowedMoreItems = ko.observable(false);
        this.isProTip = ko.observable(false);
        this.upvoteCounter = ko.observable(0);
        this.isTryDownVoteingProTip = ko.observable(false);
        this.isItemDownvoted = ko.observable(false);

        this.closeProTip = function() {
            var upVoteProTip = document.getElementById("firstUpVoteProTip");
            $(upVoteProTip).css('visibility', 'hidden');
        }
    }
}
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
            this.displayDownVoteSelected = ko.observable(false);
            this.displayUpVoteSelected = ko.observable(false);
            this.displayBorderSelected = function() {
                if (this.displayDownVoteSelected()) {
                    return 'downvotedBorder'
                } else if (this.displayUpVoteSelected()) {
                    return 'upvotedBorder'
                } else {
                    return ''
                }
            };

            this.downVote = function(parent, event) {
                console.log('down vote',this);
                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.isItemDownvoted(true);
                this.displayDownVoteSelected(true);
            }
            this.downVoteReasonSelection = function(parent,event) {
                this.displayDownVoteSelected(false);
                return true;
            }

            this.upVote = function() {
                console.log('up vote ',this);
                this.displayUpVoteSelected(true);
                var element = document.getElementById(this.itemId);
                var upvotedImage = element.querySelector('a img');
                var votedContainer = element.querySelector('.votingContainer');
                var downVoteBtn = element.querySelector('a .downVote');
                var upVoteProTip = document.getElementById("firstUpVoteProTip");
                var tryDownVoteingProTip = element.querySelector('.tryDownVoteingProTip');

                this.params.parent.isAllowedMoreItems(true);
                this.params.parent.upvoteCounter() != 2 ? this.params.parent.upvoteCounter(this.params.parent.upvoteCounter() + 1) : '';
                this.params.parent.upvoteCounter() === 2 && !this.params.parent.isItemDownvoted() ? this.params.parent.isTryDownVoteingProTip(true) : this.params.parent.isTryDownVoteingProTip(false);
                upVoteProTip.className += !this.params.parent.isProTip() ? " proTip displayProTipText" : "";
                this.params.parent.isProTip(true);
                this.params.parent.isTryDownVoteingProTip() ? $(tryDownVoteingProTip).css('display', 'block') : '';

                // $(upvotedImage).attr('class', 'upvotedBorder');
                // $(downVoteBtn).css('display', 'none');
                // $(votedContainer).css('top', 0);
            }
            this.closeProTipTryDownVoting = function() {
                var protipTryDownvotingElement = document.getElementById(this.itemId).querySelector('.tryDownVoteingProTip');
                $(protipTryDownvotingElement).css('display', 'none');
            }
        }
    },
    template: `
        <article class="product" data-bind="attr: { id: itemId }">
            <div class="responsively-lazy preventReflow">
                <a data-reveal-id="quickViewModal"><img data-bind="attr: { src: imageURL, class: displayBorderSelected() }"></a>
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
                <div data-bind="attr: { class: displayDownVoteSelected() ? 'votingContainer text-center animateUp' : 'votingContainer text-center animateDown' }">
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
                <div class="tryDownVoteingProTip">
                    <div class="">
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
            this.curr = ko.observable(9);
            this.old = ko.observable(0);
            this.isInitItemsLoaded = false;
            this.isLikeMOreItemsCopy = ko.observable(false);

            this.viewModelImage = ko.observable('');
            this.viewModelAltImages = ko.observableArray();

            // this.getViewModelAltImage = function(image) {
            //     var image = image.split('_')[0];
            //     var i = 1;
            //     this.viewModelAltImages.removeAll();
            //     while (i < 6) {
            //         this.viewModelAltImages.push(image+'_'+i+'_64px.jpg');
            //         i++;
            //     }
            // };
            this.viewItemModel = function(item) {
                console.log('item ',item);
                console.log(this);
                this.viewModelImage(item.imageURL);
            }

            self = this;
            $.getJSON( "http://localhost:3000/js/gifts_search_results.json", function(data) {
                data.products.forEach((product,index) => {
                    self.searchResults.push(product);
                })
                // console.log(self.searchResults());
                // console.log(self.searchResults().length);
            })

            this.updating = ko.observable();
            ko.bindingHandlers.scroll = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    window.onbeforeunload = function () {
                        window.scrollTo(0, 0);
                    }
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    if (self.searchResults().length != 0 && !self.isInitItemsLoaded) {
                        addItems();
                        self.isInitItemsLoaded = true;
                    }

                    if (self.isInitItemsLoaded) {
                        $(window).on("scroll.ko.scrollHandler", function () {
                            if(($(document).height() <= $(window).height() + $(window).scrollTop())) {
                                if (self.isAllowedMoreItems()) {
                                    addItems();
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
                    function addItems() {
                        self.searchResults().forEach((item,index) => {
                            index < self.curr() && index >= self.old() ? self.displaySearchResults.push(item) : '';
                        })
                        self.old(self.old() + 9);
                        self.curr(self.curr() + 9);
                    }
                }
            }
        }
    },
    template: `
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
                              <!--<label>Like to save gift ideas</label>-->
                               <label class="proTip">
                                    Like to save gift ideas

                                    <div id="firstUpVoteProTip" class="proTipText">
                                        <div class="closeProTip">
                                            <a data-bind="event:{ click: closeProTip.bind($parent) }">
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
                               </label>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Search Results -->
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

        <!-- Quick View -->
        <div id="quickViewModal" class="reveal-modal" data-reveal="" aria-hidden="true" role="dialog" style="max-width: 100%;">
            <div class="row">
                <div class="small-12 medium-7 columns">

                    <a><img data-bind="attr: { src: ugWeb + viewModelImage() }"></a>

                    <!--<div class="small-12">
                        <!-- ko foreach: viewModelAltImages() -->
                            <a><img data-bind="attr: { src: ugWeb + $data }"></a>
                        <!-- /ko -->
                    </div>
                </div>
            </div>
        </div>`, synchronous: true
});

ko.applyBindings();
