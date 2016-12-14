const ugWeb = 'http://www.uncommongoods.com';

class Dependents {
    constructor(params) {

    }
}

ko.components.register('gift-bot-results-container', {
    viewModel: class HomePageContainerComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.searchResults = ko.observableArray([]).extend({ deferred: true });
            this.displaySearchResults = ko.observableArray([]);
            this.curr = ko.observable(9);
            this.old = ko.observable(0);
            this.isInitItemsLoaded = false;
            this.isAllowedMoreItems = ko.observable(false);
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
            this.downVote = function(item) {
                this.isAllowedMoreItems(true);
                console.log('down vote ',item);
                var downVotedImage = event.target.parentNode.parentNode.parentNode.querySelector('a img');
                var votedContainer = event.target.parentNode.parentNode;
                var upVoteBtn = event.target.parentNode.parentNode.querySelector('a .upVote');

                $(downVotedImage).attr('class', 'downvotedBorder');
                $(upVoteBtn).css('display', 'none');
                $(votedContainer).css('top', 0);
            }
            this.upVote = function(item, event) {
                this.isAllowedMoreItems(true);
                console.log('up vote ',item);
                var upvotedImage = event.target.parentNode.parentNode.parentNode.querySelector('a img');
                var votedContainer = event.target.parentNode.parentNode;
                var downVoteBtn = event.target.parentNode.parentNode.querySelector('a .downVote');

                $(upvotedImage).attr('class', 'upvotedBorder');
                $(downVoteBtn).css('display', 'none');
                $(votedContainer).css('top', 0);
            }


            self = this;

            $.getJSON( "http://localhost:9000/js/gifts_search_results.json", function(data) {
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
                    $(document).foundation();
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
                              <label>like to save gift ideas</label>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Search Results -->
        <div id="giftBotResults" class="row fullwidth" data-bind="scroll">
            <div class="small-12 small-centered columns giftBotSearchResults">
                <span data-tooltip="" aria-haspopup="true" class="has-tip" data-selector="tooltip-iwo22i2p0" title="">small</span>
                <span data-selector="tooltip-iwo22i2p0" class="tooltip" style="visibility: visible; display: none; width: auto; top: 3709px; bottom: auto; left: 560.266px; right: auto;">Testing documents received, filed and up-to-date<span class="nub"></span></span>
                <ul class="small-block-grid-1 medium-block-grid-3" data-bind="foreach: displaySearchResults()">
                    <li>
                        <article class="product">
                            <div class="responsively-lazy preventReflow">
                                <a data-reveal-id="quickViewModal" data-bind="event:{ click: $parent.viewItemModel.bind($parent) }"><img data-bind="attr: { 'data-index': $index(), src: ugWeb + $data.imageURL }"></a>
                                <div class="votingContainer text-center">
                                    <a data-bind="event:{ click: $parent.downVote.bind($parent) }"><img class="voteBtns downVote" src="/images/SUN-thumb_boo.png"></a>
                                    <a data-bind="event:{ click: $parent.upVote.bind($parent) }"><img class="voteBtns upVote" src="/images/SUN-thumb_yay.png"></a>
                                </div>
                            </div>
                            <h4>
                                <a class="a-secondary" data-bind="attr: { href: ugWeb +$data.categoryURL }">
                                <span data-bind="html: $data.title"></span></a>
                            </h4>
                            <p class="body-small price" data-bind="html: price"></p>
                        </article>
                    </li>
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
        </div>






    `, synchronous: true
});

ko.applyBindings();
