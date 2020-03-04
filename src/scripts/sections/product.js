/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import {getUrlWithVariant, ProductForm} from '@shopify/theme-product-form';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';
import {forceFocus} from '@shopify/theme-a11y';

const classes = {
  hide: 'hide',
};

const keyboardKeys = {
  ENTER: 13,
};

const selectors = {
  submitButton: '[data-submit-button]',
  submitButtonText: '[data-submit-button-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  priceWrapper: '[data-price-wrapper]',
  imageWrapper: '[data-product-image-wrapper]',
  visibleImageWrapper: `[data-product-image-wrapper]:not(.${classes.hide})`,
  imageWrapperById: (id) => `${selectors.imageWrapper}[data-image-id='${id}']`,
  productForm: '[data-product-form]',
  productPrice: '[data-product-price]',
  thumbnail: '[data-product-single-thumbnail]',
  thumbnailById: (id) => `[data-thumbnail-id='${id}']`,
  thumbnailActive: '[data-product-single-thumbnail][aria-current]',
};


register('product', {
  async onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);

    this.product = await this.getProductJson(
      productFormElement.dataset.productHandle,
    );
    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this),
    });

    this.onThumbnailClick = this.onThumbnailClick.bind(this);
    this.onThumbnailKeyup = this.onThumbnailKeyup.bind(this);

    this.container.addEventListener('click', this.onThumbnailClick);
    this.container.addEventListener('keyup', this.onThumbnailKeyup);
    //this.container.addEventListener('change', this.onFormOptionChange.bind(this));
  },
  onUnload() {
    this.productForm.destroy();
    this.removeEventListener('click', this.onThumbnailClick);
    this.removeEventListener('keyup', this.onThumbnailKeyup);
  },

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => {
      return response.json();
    });
  },

  onFormOptionChange(event) {
    //alert(JSON.stringify(event));
    const variant = event.dataset.variant;
    this.renderSwatches(variant);
    this.renderSelectedColor(variant);
    this.renderImages(variant);
    //this.renderFancybox(variant);
    this.renderSlider(variant);
    //this.renderThumbnails(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);

    this.updateBrowserHistory(variant);
  },

  onThumbnailClick(event) {
    const thumbnail = event.target.closest(selectors.thumbnail);

    if (!thumbnail) {
      return;
    }

    event.preventDefault();

    this.renderFeaturedImage(thumbnail.dataset.thumbnailId);
    this.renderActiveThumbnail(thumbnail.dataset.thumbnailId);
  },

  onThumbnailKeyup(event) {
    if (
      event.keyCode !== keyboardKeys.ENTER ||
      !event.target.closest(selectors.thumbnail)
    ) {
      return;
    }

    const visibleFeaturedImageWrapper = this.container.querySelector(
      selectors.visibleImageWrapper,
    );

    forceFocus(visibleFeaturedImageWrapper);
  },

  renderSubmitButton(variant) {
    const submitButton = this.container.querySelector(selectors.submitButton);
    const submitButtonText = this.container.querySelector(
      selectors.submitButtonText,
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = theme.strings.addToCart;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.soldOut;
    }
  },

  renderSwatches(variant) {
    var selector = this.originalSelectorId;
    if (variant) {
        var form = $(selector).closest('form');
        for (var i=0,length=variant.options.length; i<length; i++) {
            var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
            if (radioButton.length) {
                radioButton.get(0).checked = true;
            }
        }
    }
  },

  renderSelectedColor(variant) {
    $('.selected_color span').html(variant.title);
  },

  renderImages(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }

    this.renderFeaturedImage(variant.featured_image.id);
    this.renderActiveThumbnail(variant.featured_image.id);
  },

  renderFancybox(variant) {
    $('.product-image .responsive-image__wrapper a').each(function() {
      var str = $(this).attr('data-variant');
      var image_alt = str.split(' - ');
      if( image_alt[1] == variant.title) {
        $(this).attr("data-fancybox","gallery");
      } else {
        $(this).removeAttr("data-fancybox");
      }
    });
  },

  renderSlider(variant) {
    $('.product-image .responsive-image__wrapper a').each(function() {
      var str = $(this).attr('data-variant');
      var image_alt = str.split(' - ');
      if( image_alt[1] == variant.title) {
        $(this).parent().addClass("slide-visible");
        $(this).parent().removeClass("hide");
      } else {
        $(this).parent().removeClass("slide-visible");
        $(this).parent().addClass("hide");
      }
    });
    mySlider.reloadSlider();
  },  

  renderThumbnails(variant) {
    if (!variant || variant.featured_image === null) {
      return;
    }
    console.log(JSON.stringify(variant));
    console.log(variant.featured_image.id);
    var counter = 0;
    $('.prodcut_gallery ul li img').each(function() {
      var wrapper = $(this);
      while ( wrapper.parent().children().length === 1 ) {
        wrapper = wrapper.parent();
      }
      if ( jQuery(this).attr('alt') === variant.title || jQuery(this).attr('data-featured-image-id') == variant.featured_image.id ) {
        wrapper.show();
        counter++;
      }
      else {
        wrapper.hide();
      }
    });

    // if(counter <= 1) {
    //   $('.prodcut_gallery ul li img').hide();     
    // }
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper,
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerText = formatMoney(variant.price, theme.moneyFormat);
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      selectors.comparePrice,
    );
    const compareTextElement = this.container.querySelector(
      selectors.comparePriceText,
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        theme.moneyFormat,
      );
      compareTextElement.classList.remove(classes.hide);
      comparePriceElement.classList.remove(classes.hide);
    } else {
      comparePriceElement.innerText = '';
      compareTextElement.classList.add(classes.hide);
      comparePriceElement.classList.add(classes.hide);
    }
  },

  renderActiveThumbnail(id) {
    const activeThumbnail = this.container.querySelector(
      selectors.thumbnailById(id),
    );
    const inactiveThumbnail = this.container.querySelector(
      selectors.thumbnailActive,
    );

    if (activeThumbnail === inactiveThumbnail) {
      return;
    }
    inactiveThumbnail.removeAttribute('aria-current');
    activeThumbnail.setAttribute('aria-current', true);
  },

  renderFeaturedImage(id) {
    const activeImage = this.container.querySelector(
      selectors.visibleImageWrapper,
      );
    const inactiveImage = this.container.querySelector(
      selectors.imageWrapperById(id),
    );

    activeImage.classList.add(classes.hide);
    inactiveImage.classList.remove(classes.hide);
  },

  updateBrowserHistory(variant) {
    const enableHistoryState = this.productForm.element.dataset
      .enableHistoryState;

    if (!variant || enableHistoryState !== 'true') {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({path: url}, '', url);
  },
});

// This takes care of attaching jquery-zoom to the main image element, firing
// when the image loads.
// $('.responsive-image__image').on('load', function() {
//   $('.product-image .responsive-image__wrapper:visible').zoom();
// });
