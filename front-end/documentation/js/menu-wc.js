'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">storefront documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link">AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminModule-9763f397557512b027a93fa247958f87"' : 'data-target="#xs-components-links-module-AdminModule-9763f397557512b027a93fa247958f87"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-9763f397557512b027a93fa247958f87"' :
                                            'id="xs-components-links-module-AdminModule-9763f397557512b027a93fa247958f87"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminHeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminLandingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminLandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterAllocateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterAllocateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemAllocateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemAllocateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemManageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemManageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LabelAllocateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelAllocateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LabelCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LabelCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScoreCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScoreCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubjectManageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubjectManageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TaxCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TaxCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreatmentCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreatmentCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreeManageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeManageComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AdminModule-9763f397557512b027a93fa247958f87"' : 'data-target="#xs-injectables-links-module-AdminModule-9763f397557512b027a93fa247958f87"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-9763f397557512b027a93fa247958f87"' :
                                        'id="xs-injectables-links-module-AdminModule-9763f397557512b027a93fa247958f87"' }>
                                        <li class="link">
                                            <a href="injectables/ItemService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ItemService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TreeService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TreeService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link">AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-3df53e06aada4c74b5ef5ff32dc648c0"' : 'data-target="#xs-components-links-module-AppModule-3df53e06aada4c74b5ef5ff32dc648c0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-3df53e06aada4c74b5ef5ff32dc648c0"' :
                                            'id="xs-components-links-module-AppModule-3df53e06aada4c74b5ef5ff32dc648c0"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LandingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotfoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotfoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthModule-6187c2610d1fea674cf18ec70f169ec4"' : 'data-target="#xs-components-links-module-AuthModule-6187c2610d1fea674cf18ec70f169ec4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthModule-6187c2610d1fea674cf18ec70f169ec4"' :
                                            'id="xs-components-links-module-AuthModule-6187c2610d1fea674cf18ec70f169ec4"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EndTrialModule.html" data-type="entity-link">EndTrialModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EndTrialModule-3c9828fd0ed2affba102d9f63179e567"' : 'data-target="#xs-components-links-module-EndTrialModule-3c9828fd0ed2affba102d9f63179e567"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EndTrialModule-3c9828fd0ed2affba102d9f63179e567"' :
                                            'id="xs-components-links-module-EndTrialModule-3c9828fd0ed2affba102d9f63179e567"' }>
                                            <li class="link">
                                                <a href="components/EndTrialComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EndTrialComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' : 'data-target="#xs-components-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' :
                                            'id="xs-components-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' }>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImageDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImageDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' : 'data-target="#xs-injectables-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' :
                                        'id="xs-injectables-links-module-SharedModule-68161a8ba7f632e8ff1e819fd7e95c5c"' }>
                                        <li class="link">
                                            <a href="injectables/ImageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ImageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrialModule.html" data-type="entity-link">TrialModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' : 'data-target="#xs-components-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' :
                                            'id="xs-components-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                            <li class="link">
                                                <a href="components/FilterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FoodCardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FoodCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FoodDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FoodDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InfoDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InfoDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemGridComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemGridComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShoppingCartComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShoppingCartComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShoppingMetricsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShoppingMetricsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SubjectSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubjectSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SwapDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SwapDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SwapOptDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SwapOptDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TreatmentSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreatmentSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrialComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrialComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrialConfigComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrialConfigComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrialLandingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrialLandingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrialShopComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TrialShopComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' : 'data-target="#xs-directives-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' :
                                        'id="xs-directives-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                        <li class="link">
                                            <a href="directives/FixedNavDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixedNavDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ScoreDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScoreDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' : 'data-target="#xs-injectables-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' :
                                        'id="xs-injectables-links-module-TrialModule-dce8c951d9f56da68d4f4012f80385b9"' }>
                                        <li class="link">
                                            <a href="injectables/FilterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FilterService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProductService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProductService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ShoppingCartService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ShoppingCartService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrialRoutingModule.html" data-type="entity-link">TrialRoutingModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminUserService.html" data-type="entity-link">AdminUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsService.html" data-type="entity-link">EventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LabelService.html" data-type="entity-link">LabelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoutingTrackerService.html" data-type="entity-link">RoutingTrackerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScoreService.html" data-type="entity-link">ScoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaxService.html" data-type="entity-link">TaxService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrialLabelService.html" data-type="entity-link">TrialLabelService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrialSubjectService.html" data-type="entity-link">TrialSubjectService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/ItemResolverService.html" data-type="entity-link">ItemResolverService</a>
                            </li>
                            <li class="link">
                                <a href="guards/TreatmentService.html" data-type="entity-link">TreatmentService</a>
                            </li>
                            <li class="link">
                                <a href="guards/TrialTreatmentService.html" data-type="entity-link">TrialTreatmentService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ExampleFlatNode.html" data-type="entity-link">ExampleFlatNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginData.html" data-type="entity-link">LoginData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResp.html" data-type="entity-link">LoginResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterData.html" data-type="entity-link">RegisterData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterResp.html" data-type="entity-link">RegisterResp</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});