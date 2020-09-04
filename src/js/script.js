const jQuery = require('jquery')
const $ = jQuery
const slick = require('slick-carousel')

$(document).ready(function(){
	// Слайдер верхний на главной
	$('.main-baner-slider').slick({
		arrows : false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 5000,
	});
	// Слайдер отделений на главной
	$('.branches-slider').slick({
		arrows : false,
		dots: true,
		infinite: false,
		swipe: false,
		adaptiveHeight: true
	});
	var paginator = []
	var objects = $('.branches-slider .slider-item .container').find('h2')
	$.each(objects, (index, item) => {
		paginator.push(item.textContent);
	});
	var array_li = ($('.branches-slider .slick-dots li'))
	$.each(array_li, (index, item) => {
		item.textContent = paginator[index]
	})
	// Слайдер с фотками на главной
	$('.slider_photo').slick({
		dots: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					dots: false,
				}
			}
		]
	});
	// Слайдер с акциями на главной
	$('.action_slider').slick({
		slidesToShow: 5,
		slidesToScroll: 1,
		infinite: false,
		swipe: false,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 2400,
				settings: {
				  slidesToShow: 4,
				  slidesToScroll: 1,
				  adaptiveHeight: true,
				}
			  },
			{
				breakpoint: 1800,
				settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				adaptiveHeight: true,
				}
			},
			{
				breakpoint: 1025,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					arrows: false,
					swipe: true,
					adaptiveHeight: true,
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					arrows: false,
					swipe: true,
					adaptiveHeight: true,
				}
			},
		]
	});
	$(function() {
		$(".links_cont").find("p").click(function() {
			$(".links_cont p").removeClass("active");
			$(this).toggleClass("active");
		})
	});
	$('[data-fancybox]').fancybox({
		buttons: [],
	});
	$(".stocks .stock_item").find(".img_box, .more").click(function(e) {
		e.preventDefault()

		let elem = this;
		let src, stock_item, title, text;
		if( $(this).hasClass('more') ) {
			elem = $(this).parent()[0];

			src = $(elem).find('img').attr('src');
			stock_item = elem;
			title = stock_item.children[1].innerText;
			text = stock_item.children[2].innerHTML;
		} else {
			src = $(elem).find('img').attr('src');
			stock_item = $(elem).parent();
			title = stock_item[0].children[1].innerText;
			text = stock_item[0].children[2].innerHTML;
		}

		$('.modal_stock h4').text(title);
		$('.modal_stock .text-include').html(text);
		$('.modal_stock .image-modal-stock').attr('src', src);

		$(".overlay").show()
		$("body").addClass('openModal')
		$("section").css('margin-top', 0);

		if ( $(window).width() <= '1024' ) {
			$(".modal_stock").css("display", "block")
		} else {
			$(".modal_stock").css("display", "flex")
		}
	})
	$(".close").click(e => {
		e.preventDefault()
		$(".overlay").hide();
		$("body").removeClass('openModal')
		$(".modal_stock").hide();
		$("section").css('margin-top', '112px');
	})

	// мобильное меню с навигацией
	$('.burger-box').click(function() {
		if( $('.burger-box').hasClass('open') ) {
			$('.open-block').css('height', '0');
		} else {
			$('.open-block').css('height', `${$(window).height() - 112}px`);
		}

		$('.burger-box').toggleClass('open');
		if( $('.close-block').hasClass('open') ) {
			setTimeout(function() {
				$('.close-block').toggleClass('open');
			}, 400);
		} else {
			$('.close-block').toggleClass('open');
		}
	});

	$('#feedback_phone').mask('+7 000 000 00 00');
	$('#certificate_feedback_phone').mask('+7 000 000 00 00');
	$('#feedback_date').mask('00/00/00');
	$('input[type="tel"]').mask('+ 7 (000) 000-00-00');

	// вызов формы обратной связи
	$("[script-role='feedback']").click(e => {
		e.preventDefault()
		$(".overlay, .feedback").show()
		$("body").addClass('openModal')
	})
	// закрытие формы обратной связи
	$(".feddback_close").click(e => {
		e.preventDefault()
		$(".overlay, .feedback").hide();
		$("body").removeClass('openModal')
	})
	$.validator.addMethod(
		'correctDate',
		function(value, element){
			let day = value.substring(0,2)
			let mounth = value.substring(3,5)
			let year = value.substring(6)
			if ((day >= 1 && day <= 31) && (mounth >= 1 && mounth <=12) && (year > 19)) {
				return true
			} return false
		},
		'Введите верную дату'
	)

	// Блокировка-разблокировака элементов формы
	function lockForm(form, state = 'lock') {
		const elems = $('input, button', form)
		if (state == 'lock')
			elems.attr('disabled', 'disabled')
		else
			elems.removeAttr('disabled')
	}

	//валидатор формы
	let formWithCheckbox = $('#form')
	$(formWithCheckbox).validate({
		rules:
		{
			name: {
				required: true,
			},
			phone:{
				required: true,
				minlength: 11
			},
			date:{
				required: true,
				correctDate: true
			},
		},
		submitHandler: function(form) {
			const placeElement = $('input[name=place]', form)
			const placeValue = placeElement.length ? getBeautyshopPaginatorValue() : $('input[type=radio]:checked', form).siblings().text()

			const data = {
				title : $("h3", form).text(),
				name  : $('input[name=name]', form).val(),
				phone : $('input[name=phone]', form).val(),
				date  : $('input[name=date]', form).val(),
				place : placeValue
			}
			if ($('.check', form)[0].checked) {
				$.ajax({
					url: './php/mail.php',
					type: 'POST',
					dataType: 'text',
					data: data,
					beforeSend: function() {
						lockForm(form)
					},
					success: function(response) {
						lockForm(form, 'unlock')
						form.reset()

						// Костыль для формы на странице салона
						if (placeElement.length && window.beautyshopModalWindow)
							window.beautyshopModalWindow.close()

						$('.overlay').show()
						$('body').removeClass('openModal')
						$('.feedback').hide()
						$('.form-message').addClass('visible')

						setTimeout(function() {
							 $('.form-message').removeClass('visible')
							 $('.overlay').hide()
						}, 3000);
					},
				})
			}
			else
				$('label[for="politics"], label[for="checkbox"]', form).addClass('error-checked');
		}
	})

	// Переключение чекбокса вызывает ошибку, если он снимается, и убирает, если ставится
	$('label[for="politics"], label[for="checkbox"]', formWithCheckbox).click(function() {
		if ($('.check', formWithCheckbox)[0].checked)
			$('label[for="politics"], label[for="checkbox"]', formWithCheckbox).addClass('error-checked');
		 else
			$('label[for="politics"], label[for="checkbox"]', formWithCheckbox).removeClass('error-checked');
	})

	// вызов попап с паром
	$("[script-role='steam']").click(e => {
		e.preventDefault()
		$(".overlay, .steam").show()
		$("body").addClass('openModal')
	})
	// закрытие попап с паром
	$(".steam_close").click(e => {
		e.preventDefault()
		$(".overlay, .steam").hide()
		$("body").remvoeClass('openModal')
	});
	// слайдер с меню
	$('.menu-slider').slick({
		dots: false,
		infinite: false,
		arrows : false,
		slidesToShow: 1,
		slidesToScroll: 1,
	});
	// чайная карта
	$('.tea_card_slider').slick({
		dots: false,
		infinite: false,
		slidesToShow: 2,
		slidesToScroll: 2,
	});
	$("[script-role='tea']").click(e => {
		e.preventDefault()
		$(".overlay").show()
		$("body").addClass('openModal')
		$(".tea_card").css("z-index", "101").css("opacity", "1")
	})
	$(".tea_close").click(e => {
		e.preventDefault()
		$(".overlay").hide();
		$("body").removeClass('openModal')
		$(".tea_card").css("z-index", "-1").css("opacity", "0")
	});
	// вызов формы купить сертификат
	$("[script-role='certificate_feedback']").click(e => {
		e.preventDefault()
		$(".overlay, .certificate_feedback").show()
		$("body").addClass('openModal')
		$(".cost span").append($('.select option:selected').text())
	})
	// закрытие формы купить сертификат
	$(".certificate_close").click(e => {
		e.preventDefault()
		$(".overlay, .certificate_feedback").hide();
		$("body").removeClass('openModal')
		$(".cost span").text("");
	});

	$('#form_sert').validate({
		rules:
		{
			name: {
				required: true,
			},
			phone:{
				required: true,
				minlength: 11
			},
		},
		submitHandler: function(form) {
			const data = {
					title : $(".certificate_feedback h3").text(),
					name : $('#certificate_feedback_name').val(),
					phone : $('#certificate_feedback_phone').val(),
					cost : $(".cost span").text(),
				};
			if ($('.check')[1].checked) {
				$.ajax({
					url: './php/mail_sert.php',
					type: 'POST',
					data: data,
					beforeSend: function() {
						lockForm(form)
					},
					success: function(response) {
						lockForm(form, 'unlock')
						$('.certificate_feedback').hide();
						$("body").removeClass('openModal')
						$('#form_sert')[0].reset();
						$(".cost span").text("");
						$('.form-message').addClass('visible');
						setTimeout("$('.form-message').removeClass('visible')", 3000);
						setTimeout("$('.overlay').hide()", 3000);
					},
				});
				console.log(data);
			} else {
				$('#form_sert label[for="certificate_politics"]').addClass('error-checked');

				$('#form_sert label[for="certificate_politics"]').click(function() {
					if ($('.check')[0].checked) {
						$('#form_sert label[for="certificate_politics"]').addClass('error-checked');
					} else {
						$('#form_sert label[for="certificate_politics"]').removeClass('error-checked');
					}
				});
			}
		}
	});
	$(".form-message .form-message-close").click(() => {
		$('.form-message').removeClass('visible');
		$('.overlay').hide();
	});

	// изменение пара
	function checkTime(i){
		if (i<10) {
			i="0" + i;
		} return i;
	}
	var t = new Date();
	var hour = checkTime(t.getHours());
	steam = {
		10: "Мята",
		11: "Эвкалипт",
		12: "Мелисса",
		13: "Эвкалипт",
		14: "Мята",
		15: "Полынь",
		16: "Хрен",
		17: "Чеснок",
		18: "Эвкалипт",
		19: "Мелисса",
		20: "Хрен",
		21: "Чеснок",
		22: "Мята"
	}
	$("#type_of_steam").text(steam[hour]);

	// меню
	$("[script-role='menu']").click(e => {
		e.preventDefault()
		$(".overlay").show()
		$("body").addClass('openModal')
		$(".menu").css("z-index", "101").css("opacity", "1")
	})
	$(".menu_close").click(e => {
		e.preventDefault()
		$(".overlay").hide();
		$("body").removeClass('openModal')
		$(".menu").css("z-index", "-1").css("opacity", "0")
	});

	//смена контента на странице с бронированием
	$('.tab-block p').each(function(index) {
		$(this).click(() => {
			$('.tab-block p').removeClass('active');
			$(this).addClass('active');
			$('.reserv_content').removeClass('active');
			$(`.reserv_content[data-id=${$(this).data("id")}]`).addClass('active');
		});
	});
	// смена контента на странице отделений
	$('.department-paginator p').each(function(index) {
		$(this).click(() => {
			const id = this.dataset.id
			$('.department-paginator p').removeClass('active');
			$(this).addClass('active');
			$('.department-block .department-item').removeClass('active');
			$(`.department-block .department-item[data-id=${id}]`).addClass('active');
			// VIP слайдер на странице с отделениями
			if (this.innerText === "Vip-кабинки") {
				$('.vip-slider').slick({
					arrows : false,
					dots: true,
				});
			}
		});
	});
	// смена контента на странице услуги
	$('.service-paginator p').each(function(index) {
		$(this).click(() => {
			$('.service-paginator p').removeClass('active');
			$(this).addClass('active');
			$('.service-block .service-item').removeClass('active');
			$(`.service-block .service-item[data-id=${$(this).data("id")}]`).addClass('active');
			// адаптив для услуг
			let weightsLeft = $('.wrapper_weight_left.auto-height p');
			let weightsRight = $('.wrapper_weight_right.auto-height p');
			let priceRight = $('.wrapper_price_right.auto-height p');
			let priceLeft = $('.wrapper_price_left.auto-height p');
			$('.wrapper_text_left.auto-height p').each(function(index, item) {
				$(weightsLeft[index]).height($(this).height());
				$(priceLeft[index]).height($(this).height());
			});
			$('.wrapper_text_right.auto-height p').each(function(index, item) {
				$(weightsRight[index]).height($(this).height());
				$(priceRight[index]).height($(this).height());
			});
		});
	});

	// Форма отзывов
	$('#recall').validate({
		rules:
		{
			name: {
				required: true,
			},
			recall: {
				required: true,
			},
			terms: {
				required: true,
			}
		},
		submitHandler: function(form) {
			let phone = $('#recall input[name=phone]').val()
			if (!$('#recall input[name=phone]').val()) {
				phone = 'Не указан'
			}
			var data = {
					title : 'Отзыв',
					name : $('#recall input[name=name]').val(),
					phone : phone,
					text: $('#recall textarea').val(),
				};
			$.ajax({
					url: './php/recall.php',
					type: 'POST',
					data: data,
				beforeSend: function() {
					lockForm(form)
				},
				success: function(response) {
					lockForm(form, 'unlock')
					$("body").removeClass('openModal')
					$('.overlay').show();
					$('#recall')[0].reset();
					$('.form-message').addClass('visible')
					setTimeout("$('.form-message').removeClass('visible')", 3000);
					setTimeout("$('.overlay').hide()", 3000);
				},
			});
		}
	});
});

class ModalWindow {
	constructor(selector) {
		this.modalWindow = document.querySelector(selector)
		console.assert(this.modalWindow, `Не найдено модальное окно с классом ${selector}`)
		if (!this.modalWindow) return 0

		this.modalWindow.addEventListener('keydown', function(ev) {
			if (ev.code == 'Escape')
				ev.stopPropagation()
		})

		const closeButton = this.modalWindow.querySelector('.close_modal')
		if (closeButton)
			closeButton.addEventListener('click', () => this.close())
	}

	open() {
		if (!this.modalWindow) return 0
		$('.overlay').show()
		document.body.classList.add('openModal')
		this.modalWindow.classList.add('visible')
		const fieldWithAutofocus = this.modalWindow.querySelector('[data-autofocus]')
		if (fieldWithAutofocus) fieldWithAutofocus.focus()
	}

	close() {
		if (!this.modalWindow) return 0
		$('.overlay').hide()
		document.body.classList.remove('openModal')
		this.modalWindow.classList.remove('visible')
	}
}

const modalWindowController = {
	modals: [],
	escHandlerRun: false,      // Статус готовности обработчика события кнопки escape
	overlayHandlerRun: false,  // Статус готовноксти обработчика клика на оверлее

	newModal(selector) {
		if (!this.escHandlerRun) {
			this.escHandlerRun = true
			window.addEventListener('keydown', ev => {
				if (ev.code == 'Escape')
					this.closeAllModals()
			})
		}

		if (!this.overlayHandlerRun) {
			this.overlayHandlerRun = true
			$('.overlay').click(() => this.closeAllModals())
		}

		const newWindow = new ModalWindow(selector)
		this.modals.push(newWindow)
		return {
			open: this.open(newWindow),
			close: () => this.closeAllModals()
		}
	},

	closeAllModals() {
		for (let modal of this.modals)
			if (modal.close)
				modal.close()
	},

	// Перед открытием окна нужно закрыть остальные
	open(modalWindow) {
		const obj = this
		return function() {
			obj.closeAllModals()

			if (modalWindow.open) modalWindow.open()
		}
	}
}

// Скрипты страницы салона
function getBeautyshopPaginatorValue() {
	const values = [
		'',
		'Стрижка',
		'Педикюр',
		'Маникюр'
	]
	return values[+$('section.beautyShop .department-paginator .active').data('id')]
}

$(function() {
	if (!$('section.beautyShop').length) return 0

	window.beautyshopModalWindow = modalWindowController.newModal('.orderBeautyShop')

	$('section.beautyShop .buyService').on('click', function() {
		if (beautyshopModalWindow)
			beautyshopModalWindow.open()
		else
			alert('Произошла ошибка')
	})
})
