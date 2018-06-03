/**
 * Created by Cooper on 2018/4/20.
 */

$(window).bind('beforeunload', function() {
  let unsaved = false;
  $('.api').each(function() {
    if ($(this).hasClass('unsaved')) {
      unsaved = true;
    }
  });
  if (unsaved) {
    return 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?';
  }
});

$('.api').on('input', ':input', function() {
  // unsaved = true;
  // console.log('========= unsaved', unsaved);
  const $api = $(this).closest('.api');
  $api.addClass('unsaved');
});

$(function() {
  $('#sortable').sortable();
  $('#sortable').disableSelection();

  // collapse direction class
  $('button[data-toggle="collapse"]').click(function() {
    if ($(this).hasClass('glyphicon-chevron-up')) {
      $(this).removeClass('glyphicon-chevron-up');
      $(this).addClass('glyphicon-chevron-down');
    } else {
      $(this).removeClass('glyphicon-chevron-down');
      $(this).addClass('glyphicon-chevron-up');
    }
  });

  // collapse/expand all
  $('.glyphicon-fullscreen').click(function() {
    $(this).toggleClass('active');
    var clps = $('.api button[data-toggle="collapse"]');
    if ($(this).hasClass('active')) {
      $('.collapse').collapse('show');
      clps.removeClass('glyphicon-chevron-up');
      clps.addClass('glyphicon-chevron-down');
    } else {
      $('.collapse').collapse('hide');
      clps.removeClass('glyphicon-chevron-down');
      clps.addClass('glyphicon-chevron-up');
    }
  });

  // input editable toggle
  // $('.api .glyphicon-pencil').click(function() {
  //   $(this).toggleClass('active');
  //   if ($(this).hasClass('active')) {
  //     $(this)
  //       .closest('.api')
  //       .find('.collapse')
  //       .collapse('show');
  //     $(this)
  //       .closest('.api')
  //       .find('.remove')
  //       .show();
  //     $(this)
  //       .closest('.api')
  //       .find('input')
  //       .removeAttr('disabled'); //enable
  //   } else {
  //     $(this)
  //       .closest('.api')
  //       .find('.remove')
  //       .hide();
  //     $(this)
  //       .closest('.api')
  //       .find('input')
  //       .attr('disabled', 'disabled'); //disable
  //   }
  // });

  // remove click
  $('.remove').click(function() {
    let r = confirm('delete?');
    if (r) {
      let name = $(this)
        .closest('.api')
        .find('.name b')
        .text();
      $.post('/admin/remove', { name }, function(data) {});
    }
  });

  // save click
  $('.glyphicon-inbox').click(function() {
    const $api = $(this).closest('.api');
    let name = $api.find('.name b').text();
    let path = $api.find('.path input').val();

    let targets = [];
    $api.find('.targets li').each((i, e) => {
      if (i > 0) {
        targets.push({
          url: $(e)
            .find('input:nth-child(1)')
            .val(),
          weight: Number(
            $(e)
              .find('input:nth-child(2)')
              .val(),
          ),
          status: Number(
            $(e)
              .find('input:nth-child(2)')
              .val(),
          ),
        });
      }
    });

    let consumers = [];
    $api.find('.consumers li').each((i, e) => {
      if (i > 0) {
        consumers.push({
          apikey: $(e)
            .find('input:nth-child(1)')
            .val(),
          status: Number(
            $(e)
              .find('input:nth-child(2)')
              .val(),
          ),
        });
      }
    });

    let order = Number($api.find('.order input').val());

    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/admin/save',
      contentType: 'application/json',
      data: JSON.stringify({
        name,
        path,
        targets,
        consumers,
        order,
      }),
      success: function(o) {},
    });
  });

  $('.add span').click(function() {
    $('.add').before(
      '<li class="api ui-sortable-handle new"><div class="base navbar justify-content-between row"><div class="navbar-left col-md-8"><div class="name col-md-4"><span>Name:</span><input type="text"></div><div class="path col-md-4"><span>Path:</span><input value="" type="text"></div><span>T<dd class="badge badge-info">2</dd></span><span>C<dd class="badge badge-info">1</dd></span><span>O<dd class="badge badge-info">2</dd></span></div><div class="navbar-right"><button class="btn glyphicon glyphicon-pencil active"></button><button class="btn glyphicon glyphicon-inbox"></button><button class="btn glyphicon glyphicon-refresh"></button><button class="btn btn-primary glyphicon glyphicon-chevron-up" type="button" data-toggle="collapse" data-target="#new-collapse" aria-expanded="true" aria-controls="new-collapse"></button></div></div><div class="content collapse in" id="new-collapse" aria-expanded="true" style=""><hr><div class="targets row"><span class="col-md-1">Targets:</span><ul class="col-md-10"><li class="col-md-10"><span class="col-md-5">url</span><span class="col-md-2">weight</span><span class="col-md-2">status</span></li><li class="col-md-10"><input class="col-md-5" value="" type="text"><input class="col-md-2" value="" type="text"><span class="col-md-2 glyphicon glyphicon-dot"></span></li></ul></div><hr><div class="consumers row"><span class="col-md-1">Consumers:</span><ul class="col-md-10"><li class="col-md-10"><span class="col-md-5">apikey</span><span class="col-md-2">status</span></li><li class="col-md-10"><input class="col-md-5" value="" type="text"><span class="col-md-2 glyphicon glyphicon-dot">1</span></li></ul></div><hr><div class="order row"><span class="col-md-1">Order:</span><input class="col-md-1" value="" type="text"><a class="remove" href="javascript:void(0)">remove this one !!</a></div></div></li>',
    );
  });
});

// input editable toggle
$('#content').on('click', '.glyphicon-pencil', function() {
  const $api = $(this).closest('.api');
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $api.find('.collapse').collapse('show');
    $api.find('.remove').show();
    $api.find('li .col-md-1').show();
    $api.find('input').removeAttr('disabled'); //enable
    $api.find('input').addClass('editable');
  } else {
    $api.find('.remove').hide();
    $api.find('li .col-md-1').hide();
    $api.find('input').attr('disabled', 'disabled'); //disable
    $api.find('input').removeClass('editable');
  }
});

$('#content').on('click', '.glyphicon-inbox', function() {
  const $api = $(this).closest('.api');

  let name = $api.find('.name b').text() || $api.find('.name input').val();
  let path = $api.find('.path input').val();

  let targets = [];
  $api.find('.targets li').each((i, e) => {
    if (i > 0) {
      targets.push({
        url: $(e)
          .find('input:nth-child(1)')
          .val(),
        weight: Number(
          $(e)
            .find('input:nth-child(2)')
            .val(),
        ),
        status: Number(
          $(e)
            .find('input:nth-child(2)')
            .val(),
        ),
      });
    }
  });

  let consumers = [];
  $api.find('.consumers li').each((i, e) => {
    if (i > 0) {
      consumers.push({
        apikey: $(e)
          .find('input:nth-child(1)')
          .val(),
        status: Number(
          $(e)
            .find('input:nth-child(2)')
            .val(),
        ),
      });
    }
  });

  let order = Number($api.find('.order input').val());

  $.ajax({
    type: 'post',
    url: '/admin/save',
    data: JSON.stringify({
      name,
      path,
      targets,
      consumers,
      order,
    }),
    success: function(data) {
      console.log(data, '====');
      $api.removeClass('unsaved');
      if ($api.hasClass('new')) {
        location.reload();
      }
    },
    contentType: 'application/json',
    dataType: 'json',
  });
});

$('#content').on('click', '.targets .glyphicon-plus-sign', function() {
  const $ul = $(this).closest('ul');
  $ul.append(
    '<li class="col-md-10"><input class="col-md-5" value="" type="text"><input class="col-md-2" value="" type="text"><span class="col-md-2 glyphicon glyphicon-dot"></span><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li>',
  );
});

$('#content').on('click', '.consumers .glyphicon-plus-sign', function() {
  const $ul = $(this).closest('ul');
  $ul.append(
    '<li class="col-md-10"><input class="col-md-5" value="" type="text"><span class="col-md-2 glyphicon glyphicon-dot"></span><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li>',
  );
});

$('#content').on('click', '.col-md-1.glyphicon-minus-sign', function() {
  $(this)
    .closest('li')
    .remove();
});
