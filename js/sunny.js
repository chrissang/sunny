const ugWeb = '//www.uncommongoods.com';

class Dependents {
    constructor(params) {
        this.isAllowedMoreItems = ko.observable(false);
        this.upvoteCounter = ko.observable(0);
        this.isItemDownvoted = ko.observable(false);

        this.upvoteMessage1 = ko.observable('Nice Choice! I added more suggestions.');
        this.upvoteMessage2 = ko.observable('You starred it,<br> I saved it!');
        this.isUpVoteMessage1 = ko.observable(false);
        this.isUpVoteMessage2 = ko.observable(false);
        this.closeUpVoteMessage1 = function() {
            this.isUpVoteMessage1(false);
        }
        this.closeUpVoteMessage2 = function() {
            this.isUpVoteMessage2(false);
        }

        this.filterMinPrice = ko.observable('');
        this.filterMaxPrice = ko.observable('');

        this.itemQuantity = ko.observableArray([0,1,2,3,4,5,6,7,8,9,10]);
        //this.productParent = ko.observable();
        this.upVotedResults = ko.observableArray([]);
        this.upVotedResultsLen = ko.observable(0);
        this.displayUpVotedResults = ko.observable(false);
        this.displaySearchResultsToggle = ko.observable(true);

        this.qvItemId = ko.observable('');
        this.qvArtistId = ko.observable('');
        this.qvImage = ko.observable('');
        this.qvTitle = ko.observable('');
        this.qvPrice = ko.observable('');
        this.qvDescription = ko.observable('');
        this.qvRating = ko.observable('');
        this.qvNumberOfReviews = ko.observable('');
        this.qvProductURL = ko.observable('');
        this.qvMaxInventory = ko.observable('');
        this.qvAltImg = ko.observableArray();
        this.qvMultiSku = ko.observableArray();
        this.qvGetLiveSku = function(itemdata) {
            if (itemdata.skus.length > 1) {
                itemdata.skus.forEach((sku, index) => {
                    sku.status === 'live' ? this.qvMultiSku.push({ 'value': sku.sku ,'name': sku.color + ' $'+sku.price }) : '';
                })
            }
        }
        this.qvGetAltImg = function(itemdata,itemDir,itemId,itemIdTrim) {
            itemdata.itemMedia.forEach((mediaType, index) => {
                mediaType.mediaTypeId === 1 ? this.qvAltImg.push(itemDir+itemIdTrim+'00/'+itemId+'_'+(index+1)) : '';
            })
        }

        // storyTab
        this.qvHeadline = ko.observable('');
        this.qvItemDescription = ko.observable('');
        this.qaIsUSA = ko.observable('');
        this.qvHasDetail = ko.observable('');
        this.qvEnvironment = ko.observable('');
        this.qvIsHandMade = ko.observable('');
        this.qvMaterials = ko.observable('');
        this.qvSizeInfo = ko.observable('');
        this.qvCareInstructions = ko.observable('');
        this.qvSpecialNotes = ko.observable('');
        this.qvAgeRecommendation = ko.observable('');

        this.toggleProductFade = ko.observable(false);
        this.scrollPosToQuickView = ko.observable();
        this.isDisplayQuickView = ko.observable(false);
        this.quickViewElement = ko.observable();
        this.quickViewContentElement = ko.observable();
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
                    <div class="small-10 large-6 columns small-centered">
                        <div class="row">
                            <div class="small-12 medium-6 columns">
                                <a data-bind="attr: { href: $data.productURL(), target: '_blank' }"><img data-bind="attr: { src: $data.imageURL() }"></a>
                            </div>
                            <div class="small-12 medium-6 text-center columns">
                                <h1 data-bind="text: $data.title"></h1>
                                <div class="intro-text qvItemDescription" data-bind="getItemDescription: $data.itemId()"></div>
                                <p class="item-price price">
                                    <span data-bind="text: $data.price()"></span>
                                </p>
                                <div class="avgRating">
                                    <span data-bind="attr: { class: 'fontStars-'+ $data.rating().toString().replace('.','_') }"></span><span class="body-mini">(<span data-bind="text: $data.numberOfReviews() != '' ? $data.numberOfReviews() : '0'"></span>)</span>
                                </div>
                            </div>

                            <div class="small-12 medium-6  columns">
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

function breakpointValue() {
    return window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
ko.components.register('quickview', {
    viewModel: class QuickViewModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.viewPortSize = ko.observable(breakpointValue());
            this.starClass = ko.observable( this.params.parent.qvRating().split(".")[1] === "5" ? this.params.parent.qvRating().replace(".","_") : this.params.parent.qvRating().split(".")[0] );
            this.goToDetails = function() {
               $('html,body').animate({scrollTop: $(".tab-title a[href='#details']").offset().top}, 500, function(){
                   $(".tab-title a[href='#details']").click();
               });
            }
            this.closeQuickView = function() {
                var self = this;
                var pfx = ["webkit", "moz", "MS", "o", ""];

                this.params.parent.quickViewContentElement().className = 'qvContent slideDown';
                this.params.parent.quickViewElement().querySelector('.icon-close').className = 'icon-close icon-lg slideDown';

                function prefixedEventListener(element, type, callback) {
                	for (var p = 0; p < pfx.length; p++) {
                		if (!pfx[p]) type = type.toLowerCase();
                		element.addEventListener(pfx[p]+type, callback, false);
                	}
                }
                document.getElementById('sunny').className = '';
                self.params.parent.isDisplayQuickView(false);
                self.params.parent.toggleProductFade(false);
                document.getElementById(self.params.parent.qvItemId()).querySelector('.push').className = 'push';
                $('html, body').animate({
                    scrollTop: self.params.parent.scrollPosToQuickView()
                },400)

                // prefixedEventListener(this.params.parent.quickViewContentElement(),"AnimationEnd",function(e){
                //
                //
                // });
            }
            this.bindingHandlers = {
                init: $(function () {
                    $(document).foundation();
                    var altSwiper = new Swiper ('#altImages', {
                        // Optional parameters
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
        }
    },
    template: `
        <div id="quickView">
            <div class="quickViewInner">
                <div class="qvContent">
                    <div class="row">
                        <!-- main/alt images -->
                        <div class="small-12 medium-7 columns">
                            <a data-bind="attr: { href: params.parent.qvImage() + '_1_1200px.jpg' }" itemprop="image" id="mainImage" class="MagicZoom" data-options="zoomOn: click; zoomPosition: inner; hint: off;lazyZoom: true" >
                                <img data-bind="attr:{ src: params.parent.qvImage() + '_1_640px.jpg', alt: params.parent.qvTitle()}" />
                            </a>
                            <div class="row">
                                <div class="small-12 columns">
                                    <div class="swiper-container" id="altImages">
                                        <div class="swiper-wrapper">
                                            <!-- ko foreach: params.parent.qvAltImg() -->
                                                <div class="swiper-slide">
                                                    <a data-bind="attr: { href: $data + '_1200px.jpg' }" class="mz-thumb-selected mz-thumb" data-image="/images/items/25500/25589_1_640px.jpg" data-zoom-id="mainImage">
                                                        <img data-bind="attr: { src: $data + '_64px.jpg' }" alt="Morning, Noon and Night Coffee 1 thumbnail" data-altimagenumber="1">
                                                    </a>
                                                </div>
                                            <!-- /ko -->
                                        </div>
                                        <div class="swiper-button-prev"><span class="icon-caret_left icon-lg"></span></div>
                                        <div class="swiper-button-next"><span class="icon-caret_right icon-lg"></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="small-12 medium-5 columns">
                            <!-- upvote star -->
                            <div data-bind="attr: { class: 'starContainer text-center quickViewStar' }">
                                <div data-bind="attr: { class: 'outterCircle' }">
                                    <div data-bind="attr:{ class: 'starExplode' }"></div>

                                    <div data-bind="attr: { class: 'innerCircle' }">
                                        <span data-bind="attr: { class: 'icon-star' }"></span>
                                    </div>
                                </div>
                            </div>

                            <!-- copy/price -->
                            <h1 class="text-center" data-bind="html: params.parent.qvTitle()"></h1>
                            <div class="hide-for-small-only text-center intro-text" data-bind="html: params.parent.qvDescription()"></div>

                            <!-- artist copy for small -->
                            <div class="row show-for-small-only">
                    			<div class="small-12 text-center columns">
                    				<span class="body-small-caps" style="display:inline-block;margin-bottom:.25rem;">created by</span>
                    				<h3><a class="ug-activeColor">John, Rhonda and Harrison Jenkins</a></h3>
                    			</div>
                    		</div>

                            <!-- price -->
                            <p class="item-price price text-center"><span data-bind="html: params.parent.qvPrice()"></span></p>

                            <!-- reviews -->
                            <div class="row">
                                <div class="small-12 large-10 small-centered columns">
                                    <div class="pr-snippet">
                                        <div class="pr-snippet-wrapper">
                                            <div class="pr-snippet-stars">
                                                <div data-bind="attr: { class: 'pr-stars pr-stars-small pr-stars-' + starClass() + '-sm' }">&nbsp;</div>
                                            </div>
                                            <div class="pr-snippet-read-write">
                                                <div class="pr-snippet-read-reviews">
                                                    <a data-bind="attr: { href: '#pr-review-engine-'+ params.parent.qvItemId() }" class="pr-snippet-link">Read <span data-bind="text: params.parent.qvNumberOfReviews()"></span> Reviews</a>
                                                </div>
                                                <div class="pr-snippet-write-review">
                                                    <a data-bind="attr: { href: '/reviews/write?itemId=' + params.parent.qvItemId() }" class="pr-snippet-link">Write a Review</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- artist -->
                            <div class="row">
                                <!-- ko if: params.parent.qvArtistId() -->
                                    <div class="row hide-for-small-only">
                                        <div class="medium-12 large-10 medium-centered columns">
                                            <div id="artistBlock" class="withPhoto">
                                                <img data-bind="attr: { src: '/images/artist/Artist_28745.jpg' }" class="artistPhoto" alt="John, Rhonda and Harrison Jenkins">
                                                <span class="body-small-caps">created by</span>
                                                <h3 id="artistHeading">John, Rhonda and Harrison Jenkins</h3>
                                                <span class="body-small a-tertiary" style="display:inline;">read more about the maker</span>
                                            </div>
                                        </div>
                                    </div>
                                <!-- /ko -->
                            </div>

                            <!-- single/multi sku -->
                            <form name="itemForm" id="itemForm" method="post">
                                <!-- ko if: params.parent.qvMultiSku().length === 0 -->
                                    <div class="row">
                                        <div class="small-4 large-3 small-push-0 large-push-1 columns">
                                            <select data-bind="foreach: new Array(params.parent.qvMaxInventory())" id="quantity" name="qty" class="urgent">
                                                <option data-bind="text: $index() + 1"></option>
                                            </select>
                                        </div>

                                        <div class="small-8 large-7 small-pull-0 large-pull-1 columns">
                                            <input type="button" value="add to cart" id="a2c" class="urgent expand">
                                        </div>
                                    </div>
                                <!-- /ko -->

                                <!-- ko if: params.parent.qvMultiSku().length > 0 -->
                                    <div class="small-8 large-7 small-push-0 large-push-1 columns">
                                        <select data-bind="options: params.parent.qvMultiSku(), optionsText: 'name', optionsValue: 'value'" id="selectitem" class="multiSku"></select>
                                    </div>

                                    <div class="small-4 large-3 small-push-0 large-push-1 columns">
                                        <select data-bind="foreach: new Array(params.parent.qvMaxInventory())" id="quantity" name="qty" class="urgent">
                                            <option data-bind="text: $index() + 1"></option>
                                        </select>
                                    </div>

                                    <div class="small-12 large-10 large-centered columns" style="clear:both">
                                        <input type="button" value="add to cart" id="a2c" class="urgent expand">
                                    </div>
                                <!-- /ko -->
                            </form>

                            <!-- whish list -->
                            <div class="row">
                                <div class="small-12 large-10 large-centered columns text-center">
                                    <div id="NEWwishlist" style="clear:both;" class="addMove notLoggedIn">
                                        <input id="wishListPreviousAction" type="hidden">
				                        <span id="iih" class="icon-heart_hollow icon-md icon-button" style=""></span>
                                        <div class="moveBtn">
                                            <span class="moveCopy ug-SecondaryColor icon-button " style="" data-oldcopy="add to wish list">add to wish list</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row fullbleed collapse">
                        <div class="small-12 columns">
                            <ul class="tabs" data-tab>
                                <li class="tab-title active"><a href="#the-story" class="theStoryTab"><span class="hide-for-small-only theStoryTab">the&nbsp;</span>story</a></li>
                                <li class="tab-title"><a href="#details" id="theDetailsTab">details</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="unco">
                        <div class="row">
                            <div class="small-12 columns">
                                <div class="tabs-content">
                                    <div class="content active" id="the-story">
                                        <div class="row">
                                            <div class="small-12 medium-10 large-7 small-centered columns end">
                                                <div class="theStoryCopy">
                                                    <h2 data-bind="html: params.parent.qvHeadline()"></h2>
                                                    <p data-bind="html: params.parent.qvItemDescription()"></p>
                                                    <div style="padding-top:1.5rem;padding-bottom:3rem">
                                                        <!-- ko if: params.parent.qvIsHandMade() -->
                                                            <span class="icon-handmade icon-md"></span>
                                                        <!-- /ko -->
                                                        <!-- ko if: params.parent.qvEnvironment() -->
                                                            <span class="icon-recycle icon-md"></span>
                                                        <!-- /ko -->
                                                        <!-- ko if: params.parent.qvHasDetail() -->
                                                            <span class="icon-exclusive icon-md"></span>
                                                        <!-- /ko -->
                                                        <!-- ko if: params.parent.qaIsUSA() -->
                                                            <span class="icon-usa icon-md"></span>
                                                        <!-- /ko -->
                                                        <a data-bind="event: { click: goToDetails }" class="body-small a-tertiary">get the details</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="content" id="details">
                                        <div class="row">
                                            <div class="small-12 medium-10 large-7 small-centered columns">
                                                <div class="clearfix">
                                                    <!-- ko if: params.parent.qvIsHandMade() -->
                                                        <span class="body-small-caps"><span class="icon-handmade icon-md"></span>Handmade</span>
                                                    <!-- /ko -->
                                                    <!-- ko if: params.parent.qvEnvironment() -->
                                                        <span class="body-small-caps"><span class="icon-recycle icon-md"></span>Recycled</span>
                                                    <!-- /ko -->
                                                    <!-- ko if: params.parent.qvHasDetail() -->
                                                        <span class="body-small-caps"><span class="icon-exclusive icon-md"></span>Exclusive</span>
                                                    <!-- /ko -->
                                                    <!-- ko if: params.parent.qaIsUSA() -->
                                                        <span class="body-small-caps"><span class="icon-usa icon-md"></span>Made in the USA</span>
                                                    <!-- /ko -->
                                                </div>

                                                <div class="row">
                                                    <!-- ko if: params.parent.qvAgeRecommendation() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">AGES</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                                                            <span data-bind="html: params.parent.qvAgeRecommendation()" class="body"></span>
                                                        </div>
                                                    <!-- /ko -->

                                                    <!-- ko if: params.parent.qvMaterials() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">MADE FROM</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                                                            <span data-bind="html: params.parent.qvMaterials()" class="body"></span>
                                                        </div>
                                                    <!-- /ko -->

                                                    <!-- ko if: params.parent.qvSizeInfo() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">Measurements</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                                                            <span data-bind="html: params.parent.qvSizeInfo()" class="body"></span>
                                                        </div>
                                                    <!-- /ko -->

                                                    <!-- ko if: params.parent.qvCareInstructions() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">Care</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                        									<span data-bind="html: params.parent.qvCareInstructions()" class="body"></span>
                        								</div>
                                                    <!-- /ko -->

                                                    <!-- ko if: params.parent.qvSpecialNotes() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">Notes</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                                                            <span data-bind="html: params.parent.qvSpecialNotes()" class="body"></span>
                                                        </div>
                                                    <!-- /ko -->

                                                    <!-- ko if: params.parent.qvItemId() -->
                                                        <div class="small-12 medium-3 columns shipTitle">
                                                            <span class="body-small-caps">Item ID</span>
                                                        </div>
                                                        <div class="small-12 medium-9 columns shipDescr">
                                                            <span data-bind="html: params.parent.qvItemId()" class="body"></span>
                                                        </div>
                                                    <!-- /ko -->
                                                </div>
                                                <p class="intro-text" style="margin-top:1.5rem;">Still haven't found the details you're looking for? Check out our <a>Product Q&amp;A</a>!</p>
                                                <form id="registry" name="registry" method="get">
                                                    <button id="registrybtn" class="btnShare btn-secondary" type="submit" value="Add To Gift Registry">add to registry</button>
                                                    <input type="hidden" name="selectitemGR" id="selectitemGR" value="" />
                                                    <input type="hidden" name="quantityGR" id="quantityGR" value="" />
                                                    <input type="hidden" name="action" value="registry" />
                								</form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="small-12 columns">
                            <div class="row collapse" style="padding-bottom:3rem;">
                                <div class="small-6 medium-10 large-8 small-centered columns">
                                    <hr class="dottedSpacer">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="small-12 columns">
                            <ul class="tabs" data-tab>
                                <li class="tab-title active"><a href="#PRreviews">Reviews</a>
                                <li class="tab-title"><a href="#PRQA" onclick="loadPRQA()">Product Q&amp;A</a>
                            </ul>
                        </div>
                    </div>

                    <div class="row">
                        <div class="small-12 columns">
                            <div class="tabs-content">
                                <div class="content active" id="PRreviews">
                                    <div id="inlinePR">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <a data-bind="event: { click: closeQuickView }"><span class="icon-close icon-lg"></span></a>
            </div>
        </div>`, synchronous: true
})

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
            this.displayDownVoteSelected = ko.observable(false);
            this.closeDownvoteModal = ko.observable(false);
            this.isloading = ko.observable(false);
            this.toggleOnStar = ko.observable(false);
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
                this.closeDownvoteModal(true);
                var self = this;
                setTimeout(function(){
                    self.displayDownVoteSelected(false);
                    self.closeDownvoteModal(false);
                }, 500);
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
            }

            this.displayQuickView = function(product, itemId) {
                //this.params.parent.productParent(this);
                var self = this;
            	$.getJSON( "http://www.uncommongoods.com/assets/get/item/"+self.itemId(), function( itemdata ) {
                    var itemDir = '//www.uncommongoods.com/images/items/';
                    var itemId = itemdata[0].itemId;
                    var itemIdTrim = itemId.toString().slice(0, -2);

                    self.params.parent.qvItemId(itemdata[0].itemId);
                    self.params.parent.qvImage(itemDir+itemIdTrim+'00/'+itemdata[0].itemId);
                    self.params.parent.qvDescription(itemdata[0].metaDescr);
                    self.params.parent.qvTitle(itemdata[0].toDisplayname);
                    self.params.parent.qvPrice(itemdata[0].itemPrice);
                    self.params.parent.qvRating((Math.round(itemdata[0].avgRating * 2) / 2).toFixed(1));
                    self.params.parent.qvNumberOfReviews(itemdata[0].noOfReviews);
                    self.params.parent.qvProductURL(itemdata[0].url);
                    self.params.parent.qvProductURL(itemdata[0].url);
                    self.params.parent.scrollPosToQuickView(window.pageYOffset);
                    self.params.parent.qvArtistId(itemdata[0].artistId);
                    self.params.parent.qvMaxInventory(itemdata[0].maxInventory);
                    self.params.parent.qvMultiSku([]);
                    self.params.parent.qvHeadline(itemdata[0].headline);
                    self.params.parent.qvItemDescription(itemdata[0].itemDescription);
                    self.params.parent.qaIsUSA(itemdata[0].USA);
                    self.params.parent.qvHasDetail(itemdata[0].hasDetail);
                    self.params.parent.qvEnvironment(itemdata[0].environment);
                    self.params.parent.qvIsHandMade(itemdata[0].isHandMade);
                    self.params.parent.qvMaterials(itemdata[0].materials);
                    self.params.parent.qvSizeInfo(itemdata[0].sizeInfo);
                    self.params.parent.qvCareInstructions(itemdata[0].careInstructions);
                    self.params.parent.qvSpecialNotes(itemdata[0].specialNotes);
                    self.params.parent.qvAgeRecommendation(itemdata[0].ageRecommendation);


                    self.params.parent.qvAltImg([]);
                    self.params.parent.qvGetLiveSku(itemdata[0]);
                    self.params.parent.qvGetAltImg(itemdata[0],itemDir,itemId,itemIdTrim);


                    console.log('item data ',itemdata[0]);

                    //Get an element's distance from the top of the page
                    var getElemDistance = function ( elem ) {
                        var location = 0;
                        if (elem.offsetParent) {
                            do {
                                location += elem.offsetTop;
                                elem = elem.offsetParent;
                            } while (elem);
                        }
                        return location >= 0 ? location : 0;
                    };
                    var elem = document.getElementById(''+self.itemId()+'');
                    var location = getElemDistance( elem );
                    var productHeight = document.getElementById(''+self.itemId()+'').querySelector('.product').offsetHeight;
                    var headerHeight = document.querySelector('header').offsetHeight + document.querySelector('.sunnyIcon').offsetHeight;
                    var priceFilterHeight = document.querySelector('.priceFilterContainer').offsetHeight;
                    var scrollPosition = priceFilterHeight + location + (productHeight/2);

                    document.getElementById(''+self.itemId()+'').querySelector('.push').className = 'push pushAway';
                    // document.getElementById(''+self.itemId()+'').querySelector('.push').style.height = '100vh';
                    self.params.parent.toggleProductFade(true);

                    var scrollComplete = false;
                    $('html, body').animate({
                        scrollTop: scrollPosition
                    },
                    {
                        complete : function(){
                            if(!scrollComplete){
                                scrollComplete = true;
                                document.getElementById('sunny').className = 'quickViewOpen';
                                self.params.parent.isDisplayQuickView(true);
                                self.params.parent.quickViewElement(document.getElementById('quickView'));
                                self.params.parent.quickViewContentElement(document.getElementById('quickView').querySelector('.qvContent'));
                                self.params.parent.quickViewContentElement().className = 'qvContent slideUp';
                                self.params.parent.quickViewElement().querySelector('.icon-close').className += ' slideUp';
                            }
                        }
                    }, 400)
            	})
            }
            this.exitDownVoteReason = function() {
                this.closeDownvoteModal(true);
                var self = this;
                setTimeout(function(){
                    self.displayDownVoteSelected(false);
                    self.closeDownvoteModal(false);
                }, 500);

            }
            this.toggleClick = function() {
                this.toggleOnStar(!this.toggleOnStar());
                console.log(this.toggleOnStar());
                if (this.toggleOnStar()) {
                    this.upVote();
                    // if (this.params.parent.isUpVoteMessage1()) {
                    //     $(event.target)[0].className += ' paused';
                    //     $(event.target)[0].style.color = '#ffffff';
                    // }
                } else {
                    this.displayUpVoteSelected(false);
                    this.params.parent.upVotedResults().forEach((product, index) => {
                        if (this.itemId() === product.itemId()) {
                            this.params.parent.upVotedResults().splice(index,1);
                            this.params.parent.upVotedResultsLen(this.params.parent.upVotedResults().length);
                        }
                    })
                }
            }
            ko.bindingHandlers.slideUp = {
                update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                    if (viewModel.displayDownVoteSelected()) {
                        $(element).css({ transform: 'translateY(0%)', '-webkit-transform': 'translateY(0%)', 'moz-transform': 'translateY(0%)', '-ms-transform': 'translateY(0%)', transition: '0.5s ease-in-out', '-webkit-transition': '0.5s ease-in-out', '-moz-transition': '0.5s ease-in-out' });
                    }
                    if (viewModel.closeDownvoteModal()) {
                        $(element).css({ transform: 'translateY(100%)', '-webkit-transform': 'translateY(100%)','moz-transform': 'translateY(100%)', '-ms-transform': 'translateY(100%)', transition: '0.5s ease-in-out', '-webkit-transition': '0.5s ease-in-out', '-moz-transition': '0.5s ease-in-out' });
                    }
                }
            }
        }
    },
    template: `
        <!-- ko if: params.data.display() -->
            <li data-bind="attr: { id: itemId(), class: params.parent.toggleProductFade() ? 'quickViewExpander fadeOut' : 'quickViewExpander fadeIn' }">
                <div data-bind="attr: { class: 'product ' + displayBorderSelected() }">
                    <div class="responsively-lazy preventReflow">
                        <a data-bind="event: { click: displayQuickView.bind($data) }"><img data-bind="attr: { src: imageURL() }"/></a>

                        <div data-bind="attr: { class: displayUpVoteSelected() ? 'starContainer text-center upvoted' : 'starContainer text-center' }, css: { upvoted: toggleOnStar }, event: { click: toggleClick.bind($data) }">
                            <!-- ko if: !displayDownVoteSelected() -->
                                <div data-bind="attr: { class: displayUpVoteSelected() ? 'outterCircle upvoted' : 'outterCircle' }">

                                    <div data-bind="attr:{ class: params.parent.isDisplayGateCopy() ? (displayUpVoteSelected() ? 'starExplode upvoted animate' : 'starExplode animate') : (displayUpVoteSelected() ? 'starExplode upvoted' : 'starExplode') }"></div>

                                    <div data-bind="attr: { class: displayUpVoteSelected() ? (params.parent.isDisplayGateCopy() ? 'innerCircle upvoted animate' : 'innerCircle upvoted') : (params.parent.isDisplayGateCopy() ? 'innerCircle animate' : 'innerCircle') }">
                                        <span data-bind="attr: { class: params.parent.isDisplayGateCopy() ? 'icon-star animate' : 'icon-star' }"></span>
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
                    </div>
                </div>
                <div class="push"></div>
            </li>
        <!-- /ko -->`, synchronous: true
});

ko.components.register('price-filiter', {
    viewModel: class PriceFiliterComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.params = params;
            this.upVotedItemIdArry = ko.observableArray([]);
            this.recipient = ko.observable(localStorage.getItem("sunnyRecipient"));
            this.filterByPrice = function() {
                var min = parseFloat(parseFloat(this.params.parent.filterMinPrice()).toFixed(2));
                var max = parseFloat(parseFloat(this.params.parent.filterMaxPrice()).toFixed(2));
                var totalResults = this.params.parent.displaySearchResults().length;
                var hiddenCounter = 0;
                this.upVotedItemIdArry([]);
                this.params.parent.upVotedResults().forEach((viewModel, index) => {
                    this.upVotedItemIdArry.push(viewModel.params.data.itemId);
                })

                while (totalResults--) {
                    var item = this.params.parent.displaySearchResults()[totalResults];
                    if(this.upVotedItemIdArry().indexOf(item.itemId) === -1) {
                        parseFloat(item.price.split('$')[1]) < min || parseFloat(item.price.split('$')[1]) > max ? (item.display(false), hiddenCounter ++) : item.display(true);
                    }
                }
                this.params.parent.totalGiftIdeas(this.params.parent.displaySearchResults().length - hiddenCounter);
            }
            this.startOver = function () {
                localStorage.setItem('display', 'form1');
                window.location.href = '/sunny/intro';
            };
        }
    },
    template: `
        <div class="small-12 columns priceFilterContainer">
            <div class="row">
                <div class="small-12 medium-6 columns">
                    <h3 data-bind="text:'gifts for ' + recipient()"></h3>
                    <a data-bind="event: { click: startOver }" class="a-secondary"><i class="body-small">start over</i></a>
                </div>

                <div class="small-12 medium-6 columns">
                    <div class="priceRange">
                        <p class="nav-fam">PRICE RANGE:</p>
                        <input class="minMaxPrice" type="number" placeholder="$" data-bind="value: $parent.filterMinPrice">
                        <p class="priceToCopy">to</p>
                        <input class="minMaxPrice" type="number" placeholder="$" data-bind="value: $parent.filterMaxPrice">
                        <button data-bind="event:{ click: filterByPrice }" class="btn-micro-secondary">APPLY</button>
                    </div>
                </div>
            </div>
        </div>
    `, synchronous: true
})

ko.components.register('sunny-results-container', {
    viewModel: class sunnyResultsComponentModel extends Dependents {
        constructor(params) {
            super(params);
            this.searchResults = ko.observableArray([]).extend({ deferred: true });
            this.isInitItemsLoaded = false;
            this.totalGiftIdeas = ko.observable();
            this.isDisplayGateCopy = ko.observable(false);
            this.displaySearchResults = ko.observableArray([]);
            this.displaySearchResultsTemp = ko.observableArray([]);
            this.isGiftsYouLikeBtn = ko.observable(false),
            this.suggestionsBtn = ko.observable(true),
            this.toggleGiftsYouLike = function() {
                this.upVotedResults().length > 0 ? (this.isGiftsYouLikeBtn(true), this.suggestionsBtn(false), this.displaySearchResultsToggle(false), this.displayUpVotedResults(true)) : this.isGiftsYouLikeBtn(false);
            },
            this.toggleSuggestions = function() {
                this.displayUpVotedResults(false);
                this.displaySearchResultsToggle(true)
                this.suggestionsBtn(true);
                this.isGiftsYouLikeBtn(false);
            },
            this.addItems = function(load) {
                this.displaySearchResultsTemp.removeAll();
                this.isDisplayGateCopy(false);
                var itemsToAdd = load;
                var hiddenCounter = 0;

                while (itemsToAdd--) {
                    // this.searchResults()[itemsToAdd]['display'] = ko.observable(true);
                    this.searchResults()[itemsToAdd] ? this.searchResults()[itemsToAdd]['display'] = ko.observable(true) : '';

                    if (this.filterMinPrice() != '' || this.filterMaxPrice() != '') {
                        var price = this.searchResults()[itemsToAdd] ? parseFloat(this.searchResults()[itemsToAdd].price.split('$')[1]) : '';

                        if (price >= this.filterMinPrice() && price <= this.filterMaxPrice()) {
                            this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                            this.searchResults.splice(itemsToAdd, 1);
                        }
                    } else if(this.searchResults()[itemsToAdd]) {
                        this.displaySearchResultsTemp.push(this.searchResults()[itemsToAdd]);
                        this.searchResults.splice(itemsToAdd, 1);
                    }
                }

                this.displaySearchResultsTemp.reverse();
                this.displaySearchResultsTemp().forEach((product, index) => {
                    this.displaySearchResults.push(product);
                })

                this.displaySearchResults().forEach((item, index) => {
                    item.display() ? hiddenCounter++ : '';
                })
                this.totalGiftIdeas(hiddenCounter);
            }

            self = this;
            $.getJSON( "/js/coffee_search_results.json", function(data) {
                data.products.forEach((product,index) => {
                    self.searchResults.push(product);
                })
            })

            // ko.bindingHandlers.starBlinkToggle = {
            //     update: function(element, valueAccessor, allBindingsAccessor) {
            //         var setIntervalId = setInterval(frame, 3500);
            //         animateStarsIn();
            //         function frame() {
            //             if (self.displaySearchResults().length > 18) {
            //                 clearInterval(setIntervalId);
            //             } else {
            //                 animateStarsIn();
            //             }
            //         }
            //         function animateStarsIn() {
            //             $.fn.extend({
            //                 animateStarIn: function (animationName) {
            //                     var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            //                     this.addClass(animationName).one(animationEnd, function() {
            //                         $('#results').animateStarOut('onstate starBlinkOff');
            //                     });
            //                 },
            //                 animateStarOut: function (animationName) {
            //                     var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            //                     this.addClass(animationName).one(animationEnd, function() {
            //                         var star = $(this);
            //                         setTimeout(function(){
            //                             star.removeClass('starBlinkOn');
            //                         }, 500);
            //                         setTimeout(function(){
            //                             star.removeClass('onstate starBlinkOff');
            //                         }, 1500);
            //
            //                     });
            //                 }
            //             });
            //             $('#results').animateStarIn('starBlinkOn');
            //         }
            //     }
            // }
            ko.bindingHandlers.scroll = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    window.onbeforeunload = function () {
                        window.scrollTo(0, 0);
                    }
                },
                update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    if (self.searchResults().length != 0 && !self.isInitItemsLoaded) {
                        viewModel.addItems(18);
                        self.isInitItemsLoaded = true;
                    }

                    if (self.isInitItemsLoaded) {
                        var lastScrollTop = 0;
                        $(window).on('scroll', function() {
                            var st = $(this).scrollTop();
                            if(st < lastScrollTop) {
                                if( ( ($(window).height() + $(window).scrollTop()) <= ($(document).height() - 100)  ) ) {
                                    self.isDisplayGateCopy(false);
                                }
                            } else {
                                //console.log('down 1');
                                if(($(document).height() <= $(window).height() + $(window).scrollTop())) {
                                    if (self.isAllowedMoreItems()) {
                                        viewModel.addItems(24);
                                    } else {
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
                                this.addClass('animated ' + animationName).one(animationEnd, function() {
                                    $(this).removeClass('animated ' + animationName);
                                });
                            }
                        });
                        $('#sunnyResults').animateCss('bounce');
                        self.isDisplayGateCopy(true);
                    }
                }
            }
        }
    },
    template: `
        <!-- Fixed Header -->
        <header class="sunnyResultsHeader">
            <div class="row fullWidth">
                <div class="small-12 columns ugCondensedHeaderContainer">
                    <div class="ugHeader">
                        <div class="logo-container">
                            <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" width="600" height="91" version="1.1" viewBox="-5 0 610 91"><g transform="translate(0,-961.36215)"><g transform="matrix(0.88125356,0,0,0.88125356,-1.1665022,959.21629)"><path d="m48 73.9c0.1-7.7 0.3-34.8-0.1-37.5-1.4-1.1-8.2-1-9.7 0-0.5 3.5-0.5 21.6-0.6 30.8-2.2 3.6-8.4 6-13.4 6-2.7 0-5.5-1.7-5.5-5.7 0-2.6 0.5-25.3 0.3-27.4-0.3-3-2.2-4.5-7.9-4.5-5 0-8.2 1.7-8.2 4.5v3.8H9.3C8.9 51.2 8.4 66.8 9.2 71.4c1.2 7.1 5.7 11.7 12.8 11.7 6.2 0 14-3.2 16.4-7.3 0.1 0 0.3 0 0.3 0-0.2 0.5-0.3 1.3-0.3 2.2 0 3 2 4.5 7.6 4.5 5 0 8.2-2.3 8.2-5.1v-3.5h-6.2zM61.3 43.8 61.3 43.8 61.3 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5C99 39.2 94.5 34.6 87.4 34.6c-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1l0 3.5h6.2z" class="logo-blue" "#387d9b"=""></path><path d="M7.2 13.5C5.1 11.4 3.6 12.1 2.4 13.3c-1.2 1.2-1.7 2.9 0.2 4.8 1.6 1.6 8 6.3 11 7.7 0.8 0.4 1.8-0.5 1.4-1.3-1.4-2.9-6.2-9.5-7.7-11zM51.7 13.3 51.7 13.3 51.7 13.3c-1.2-1.2-2.7-1.9-4.8 0.2-1.6 1.6-6.4 8.1-7.7 11-0.4 0.8 0.6 1.7 1.4 1.3 2.9-1.4 9.4-6.1 11-7.7 1.9-1.9 1.4-3.6 0.2-4.8zM27 2.7c-1.7 0-3.3 0.8-3.3 3.6 0 2.2 1.2 16.2 2.3 19.2 0.3 0.9 1.6 0.9 1.9 0.1 1.1-3 2.3-17.1 2.3-19.3 0-3-1.6-3.6-3.3-3.6z" class="logo-green"></path><path d="m194.1 58.5c0-20.7-10.7-23.9-22-23.9-11.3 0-22 4.9-22 23.9 0 19 10.7 23.9 22 23.9 11.3 0 22-3.2 22-23.9zm-22 15.8c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 6 0 11.7 2.1 11.7 16 0 14.2-5.7 15.8-11.7 15.8zM384.2 58.5 384.2 58.5 384.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM391.6 43.8c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.4-6.9 13.4-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2zM334.5 73.8h-6.4c0.4-7.3 0.9-22.9 0.1-27.5-1.2-7.1-5.7-11.7-12.8-11.7-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0l0 0.1c-2-4.6-6-7.4-11.5-7.4-6.2 0-14 3.2-16.4 7.3-0.1 0-0.4 0-0.7 0-2-4.6-6-7.3-11.5-7.3-6.2 0-13.7 3.2-16.1 7.3-0.1 0-0.3 0-0.3 0 0.2-0.5 0.3-1.3 0.3-2.2 0-3-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c-0.1 7.7-0.3 34.8 0.1 37.5 1.4 1.1 8.2 1 9.7 0 0.5-3.5 0.5-21.6 0.6-30.8 2.2-3.5 8.1-6.9 13.1-6.9 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-5.9 0.7-17.2 0.4-23.8 2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.3 27.4 0.3 3 2.2 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8h-6.4c0.3-6 0.7-17.4 0.4-23.9l0 0.2c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5l0-3.8h-6.4c0.3-5.9 0.7-17.3 0.4-23.8l0 0.1c2.4-3.4 8.3-6.5 13.1-6.5 2.7 0 5.5 1.6 5.5 6.6 0 2.6-0.5 25.3-0.2 27.4 0.3 3 2.3 4.5 7.9 4.5 5 0 8.2-1.7 8.2-4.5v-3.8zM143.6 71.8c-2.4 1.2-9.6 2.2-12.9 2.2-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 2.2 0 4.2 0.3 5.8 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.5h0c0-4.1-4.4-7.6-15.1-7.6-11.3 0-23 4.9-23 23.9 0 19 10.7 23.9 22 23.9 5.7 0 12.4-1.7 15-3.4 2.4-1.6 0-6.8-2.2-6.8z" class="logo-blue"></path><path d="m538.4 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zM514.9 75.1c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM589.2 58.5 589.2 58.5 589.2 58.5c0-20.7-12.2-24.8-23.5-24.8-11.3 0-23.5 5.8-23.5 24.8 0 19 12.2 24.8 23.5 24.8 11.3 0 23.5-4.1 23.5-24.8zm-23.5 16.7c-6 0-13.2-2.8-13.2-16.7 0-13.2 7.2-17 13.2-17 6 0 13.2 3 13.2 17 0 14.2-7.2 16.7-13.2 16.7zM682.2 68.5c0-15.3-24.6-14-24.6-21.9 0-3.9 1.6-5.7 7.7-5.7 2.2 0 3.9 0.3 5.5 0.7 0 7.5 1.7 8.5 4.5 8.5h1.2c3 0 4.5-1.2 4.5-9.4l0 0c0-4.1-4.1-7.6-14.8-7.6-11.3 0-18.5 3.9-18.5 14.5 0 14.4 24.4 12.8 24.4 21 0 3.8-1.5 5.6-7.5 5.6-3.6 0-5.6-0.5-7-1.4 0-7.5-1.7-8.2-4.5-8.2h-1.2c-3 0-4.5 1.2-4.5 9.5l0 0c0 4.1 5.6 7.9 16.3 7.9 11.3 0 18.5-2.6 18.5-13.5zM490.1 40.2c0-2.8-3.3-5.1-8.2-5.1-4.8 0-7 1.1-7.5 3.3-3.1-2.4-7.3-4-12-4-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.7 0 7.7-1.1 10.9-2.7 0 1.6 0 2.5 0 2.5 0 13.9-6 15.7-12 15.7-3.3 0-10.5-1-12.9-2.2-2.2 0.1-4.5 5.3-2.2 6.8 2.7 1.8 9.3 3.4 15 3.4 11.3 0 22.3-4.9 22.3-23.9 0 0 0-30.5-0.1-38.2h6.2l0-3.5zm-27.3 33.7c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.7 0 9.2 2.7 10.9 6.7l-0.1 1.5c0 4.9 0 13.6 0.1 20.6-3.4 2.1-8.1 3-10.8 3zM643.8 73.6h-6.4c0.3-5 0.6-13.9 0.5-20.5 0.3-6.8 0.3-19.7 0.3-27 0-3.6 0-8.8-0.6-10.7-0.9-2.8-1.9-4.5-7.6-4.5-5 0-8.2 2.3-8.2 5.1v3.5h6.2c0 3.5-0.1 11.1-0.1 18.5-3-2.2-7.1-3.7-11.6-3.7-11.3 0-21.5 4.9-21.5 23.9 0 19 10.7 23.9 22 23.9 3.4 0 7.7-1.5 11-4.2 0.5 2.7 2.5 4 7.9 4 5 0 8.2-1.7 8.2-4.5l0-3.8zm-27.1 0.3c-6 0-11.7-1.9-11.7-15.8 0-13.2 5.7-16 11.7-16 4.9 0 9.7 3 11.1 7.4 0 1 0 1.9 0 2.7-0.1 3.7-0.2 10.8-0.2 16.5-3.1 3.5-6.5 5.2-10.9 5.2z" class="logo-green headerLogo"></path></g></g></svg>
                        </div>
                        <div class="cartTop cartTopNoClick" id="cartTopShoppingBasket">
            				<span id="myCart" onclick="if (oldGaEnabled) _gaq.push(['_trackEvent', 'header', 'click', 'my cart']);">
            				<span class="gtmMiniCart icon-cart icon-md" data-cartitems="0"></span>
            				</span>
            				<a id="checkoutButton" href="https://www.uncommongoods.com/checkout/basket" onclick="javascript: pageTracker._trackPageview('/internal/checkout/basket?source=header');">checkout</a>
            		        <div id="cartBot" class="cartBottom"></div>
                	    </div>
                    </div>
                </div>

                <div class="small-12 columns">
                    <div class="sunnyHeader">
                        <div data-bind="attr: { class: suggestionsBtn() ? 'suggestionsContainer bkgColorOn' : 'suggestionsContainer' }">

                            <div data-bind="attr: { class: isUpVoteMessage1() ? 'upvotePrompt suggestions animateIn' : 'upvotePrompt suggestions animateOut' }">
                                <a data-bind="event:{ click: closeUpVoteMessage1.bind($data) }">
                                    <p data-bind="text: upvoteMessage1(), attr: { class: isUpVoteMessage1() ? 'intro-text animateIn' : 'intro-text' }"></p>
                                </a>
                            </div>

                            <div class="superCheckCounterBtn">
                                <input data-bind="checked: suggestionsBtn, event:{ click: toggleSuggestions() }" id="suggestions" type="checkbox">
                                <label class="super-check counter" for="suggestions">

                                    <div data-bind="attr: { class: isUpVoteMessage1() ? 'outterCircle fill' : 'outterCircle' }">
                                        <div data-bind="attr:{ class: isUpVoteMessage1() ? 'innerCircle animateIn' : 'innerCircle'}"></div>
                                        <div data-bind="text: totalGiftIdeas(), attr:{ class: isUpVoteMessage1() ? 'count animateIn' : 'count'}"></div>
                                    </div>

                                    <h2 class="circleLeft">suggestions</h2>
                                </label>
                            </div>
                        </div>

                        <div data-bind="attr: { class: isGiftsYouLikeBtn() ? 'giftsYouLikeContainer bkgColorOn' : 'giftsYouLikeContainer' }">
                            <div data-bind="attr: { class: isUpVoteMessage2() ? 'upvotePrompt giftsYouLike animateIn' : 'upvotePrompt giftsYouLike animateOut' }">
                                <a data-bind="event:{ click: closeUpVoteMessage2.bind($data) }">
                                    <p data-bind="html: upvoteMessage2(), attr: { class: isUpVoteMessage2() ? 'intro-text animateIn' : 'intro-text' }"></p>
                                </a>
                            </div>
                            <div class="superCheckCounterBtn">
                                <input data-bind="checked: isGiftsYouLikeBtn, event:{ click: toggleGiftsYouLike() }" id="giftsSaved" type="checkbox">
                                <label class="super-check counter" for="giftsSaved">
                                    <h2 data-bind="text: 'gifts you like'" class="circleRight"></h2>

                                    <!-- ko if: upVotedResultsLen() > 0 -->
                                        <div data-bind="attr: { class: isUpVoteMessage2() ? 'outterCircle fill' : 'outterCircle' }">
                                            <div data-bind="text: upVotedResultsLen() > 0 ? upVotedResultsLen() : '', attr:{ class: isUpVoteMessage2() ? 'innerCircle whiteBkg animateIn' : ( upVotedResultsLen() > 0 ? 'innerCircle ' : 'innerCircle') }"></div>
                                            <div data-bind="text: upVotedResultsLen() > 0 ? upVotedResultsLen() : '', attr:{ class: isUpVoteMessage2() ? 'count animateIn' : ( upVotedResultsLen() > 0 ? 'count updateColor' : 'count') }"></div>
                                        </div>
                                    <!-- /ko -->
                                </label>
                            </div>
                        </div>

                        <div class="sunnyIcon"></div>
                    </div>
                </div>
            </div>
        </header>
        <!-- Header End -->

        <!-- Search Results -->
        <div id="sunnyResults" class="row fullwidth sunnySearchResults" data-bind="scroll, visible: displaySearchResultsToggle()">

            <price-filiter params='parent: $data'></price-filiter>

            <div class="small-12 columns">
                <ul id="results" class="small-block-grid-2 medium-block-grid-3 xlarge-block-grid-4 xxlarge-block-grid-5" data-bind="foreach: { data: displaySearchResults() }">
                    <!-- ko component: {name: 'products', params: { data: $data, parent: $parent  } } --><!-- /ko -->
                </ul>
            </div>

            <div id="gate" class="small-12 text-center columns fullWidth">
                <div data-bind="attr: { class: isDisplayGateCopy() ? 'gate unhide' : 'gate' }">
                    <div data-bind="attr: { class: isDisplayGateCopy() ? 'animateGate animate' : 'animateGate'}">
                        <p class='call-out'>"For more ideas, star a few items!"</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Search Results End-->

        <!-- ko if: isDisplayQuickView() -->
            <quickview params='parent: $data'></quickview>
        <!-- /ko -->

        <!-- ko if: displayUpVotedResults() -->
            <!-- ko component: {name: 'upvoted-results', params: { parent: $data } } --><!-- /ko -->
        <!-- /ko -->`, synchronous: true
});

ko.applyBindings();

// var currState = history.state;
// history.pushState(history.state, null, document.URL);
// history.pushState(currState, null, document.URL);
// window.addEventListener('popstate', function (event) {
//     console.log("back button click");
//     history.pushState(event.state, null, document.URL);
// }, false);
