/**
 * Created by Cooper on 2018/4/20.
 */

$(function() {
  $('#sortable').sortable();
  $('#sortable').disableSelection();

  // collapse/expand all
  $('.glyphicon-fullscreen').click(function() {
    $(this).toggleClass('active');
    var clps = $('button[data-toggle="collapse"]');
    if ($(this).hasClass('active')) {
      $('.collapse').collapse('show');
      clps.removeClass('glyphicon-chevron-down');
      clps.addClass('glyphicon-chevron-up');
    } else {
      $('.collapse').collapse('hide');
      clps.removeClass('glyphicon-chevron-up');
      clps.addClass('glyphicon-chevron-down');
    }
  });

  //all reload click
  $('.node .glyphicon-refresh').click(function() {
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/admin/reload',
      contentType: 'application/json',
      data: JSON.stringify({ name: 'all' }),
      success: function(o) {
        console.log(o);
      },
    });
  });

  // all save click
  $('.node .glyphicon-inbox').click(function() {
    let apis = [];

    $('.api').each(function() {
      let name =
        $(this)
          .find('.name b')
          .text() ||
        $(this)
          .find('.name input')
          .val();
      let path = $(this)
        .find('.path input')
        .val();

      let targets = [];
      $(this)
        .find('.targets li')
        .each((i, e) => {
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
                  .find('select')
                  .val(),
              ),
            });
          }
        });

      let consumers = [];
      $(this)
        .find('.consumers li')
        .each((i, e) => {
          if (i > 0) {
            consumers.push({
              apikey: $(e)
                .find('input:nth-child(1)')
                .val(),
              status: Number(
                $(e)
                  .find('select')
                  .val(),
              ),
            });
          }
        });

      let order = Number(
        $(this)
          .find('.order input')
          .val(),
      );

      if (!$(this).hasClass('add')) {
        apis.push({ name, path, targets, consumers, order });
      }
    });

    $.ajax({
      type: 'post',
      url: '/admin/save?name=all',
      data: JSON.stringify(apis),
      success: function(data) {
        console.log(data, '====');
        $('.api').removeClass('unsaved');
        location.reload();
      },
      contentType: 'application/json',
      dataType: 'json',
    });
  });

  // add click
  $('.add span').click(function() {
    $('.add').before(
      '<li class="api ui-sortable-handle new"><div class="base navbar justify-content-between row"><div class="navbar-left col-md-8"><div class="name col-md-4"><span>Name:</span><input value="" type="text" class="editable"></div><div class="path col-md-4"><span>Path:</span><input value="" type="text" class="editable"></div><span>T<dd class="badge badge-info">1</dd></span><span>C<dd class="badge badge-info">1</dd></span><span>O<dd class="badge badge-info">2</dd></span></div><div class="navbar-right"><button class="btn glyphicon glyphicon-pencil active"></button><button class="btn glyphicon glyphicon-inbox"></button><button class="btn glyphicon glyphicon-refresh"></button><button class="btn btn-primary glyphicon glyphicon-chevron-up" type="button" data-toggle="collapse" data-target="#new-collapse" aria-expanded="true" aria-controls="new-collapse"></button></div></div><div class="content collapse in" id="new-collapse" aria-expanded="true" style=""><hr><div class="targets row"><span class="col-md-1">Targets:</span><ul class="col-md-10"><li class="col-md-10"><span class="col-md-5">url</span><span class="col-md-2">weight</span><span class="col-md-2">status</span><span class="col-md-1 glyphicon glyphicon-plus-sign" style="display: inline;"></span></li><li class="col-md-10"><input class="col-md-5 editable" value="" type="text"><input class="col-md-2 editable" value="" type="text"><div class="sel col-md-2"><select class="good"><option class="good" value="1">&#xe135</option><option class="ban" value="0">&#xe135</option><option class="bad" value="-1">&#xe135</option></select></div><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li></ul></div><hr><div class="consumers row"><span class="col-md-1">Consumers:</span><ul class="col-md-10"><li class="col-md-10"><span class="col-md-5">apikey</span><span class="col-md-2">status</span><span class="col-md-1 glyphicon glyphicon-plus-sign" style="display: inline;"></span></li><li class="col-md-10"><input class="col-md-5 editable" value="" type="text"><div class="sel col-md-2"><select class="good"><option class="good" value="1" selected="selected">&#xe135</option><option class="ban" value="0">&#xe135</option><option class="bad" value="-1">&#xe135</option></select></div><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li></ul></div><hr><div class="order row"><span class="col-md-1">Order:</span><input class="col-md-1 editable" value="2" type="text"><a class="remove" href="javascript:void(0)" style="display: inline;">remove this one !!</a></div></div></li>',
    );
  });

  // init select css
  $('select').each(function() {
    let v = $(this).val();
    if (v == 1) {
      $(this).addClass('good');
      $(this).removeClass('ban');
      $(this).removeClass('bad');
    } else if (v == 0) {
      $(this).addClass('ban');
      $(this).removeClass('good');
      $(this).removeClass('bad');
    } else if (v == -1) {
      $(this).addClass('bad');
      $(this).removeClass('good');
      $(this).removeClass('ban');
    }
  });
});

let $main = $('.main');

// input editable toggle
$main.on('click', '.glyphicon-pencil', function() {
  const $api = $(this).closest('.api');
  $(this).toggleClass('active');
  if ($(this).hasClass('active')) {
    $api.find('.collapse').collapse('show');
    $api.find('.remove').show();
    $api.find('li .col-md-1').show();
    $api.find('input').removeAttr('disabled'); //enable
    $api.find('select').removeAttr('disabled'); //enable
    $api.find('input').addClass('editable');
  } else {
    $api.find('.remove').hide();
    $api.find('li .col-md-1').hide();
    $api.find('input').attr('disabled', 'disabled'); //disable
    $api.find('select').attr('disabled', 'disabled'); //disable
    $api.find('input').removeClass('editable');
  }
});

$main.on('click', '.glyphicon-inbox', function() {
  const $api = $(this).closest('.api');
  saveApi($api);
});

function saveApi($api) {
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
            .find('select')
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
            .find('select')
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
}

$main.on('click', '.glyphicon-refresh', function() {
  // console.log('========= yes');
  let $api = $(this).closest('.api');
  let name = $api.find('.name b').text() || $api.find('.name input').val();
  $.ajax({
    type: 'post',
    dataType: 'json',
    url: '/admin/reload',
    contentType: 'application/json',
    data: JSON.stringify({ name }),
    success: function(o) {
      console.log(o);
    },
  });
});

$main.on('click', '.targets .glyphicon-plus-sign', function() {
  const $api = $(this).closest('.api');
  $api.addClass('unsaved');
  const $ul = $(this).closest('ul');
  $ul.append(
    '<li class="col-md-10"><input class="col-md-5 editable" value="" type="text"><input class="col-md-2 editable" value="" type="text"><div class="sel col-md-2"><select class="good"><option class="good" value="1" selected="">&#xe135</option><option class="ban" value="0">&#xe135</option><option class="bad" value="-1">&#xe135</option></select></div><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li>',
  );
});

$main.on('click', '.consumers .glyphicon-plus-sign', function() {
  const $api = $(this).closest('.api');
  $api.addClass('unsaved');
  const $ul = $(this).closest('ul');
  $ul.append(
    '<li class="col-md-10"><input class="col-md-5 editable" value="" type="text"><div class="sel col-md-2"><select class="good"><option class="good" value="" selected="selected">&#xe135</option><option class="ban" value="0">&#xe135</option><option class="bad" value="-1">&#xe135</option></select></div><span class="col-md-1 glyphicon glyphicon-minus-sign" style="display: inline;"></span></li>',
  );
});

$main.on('click', '.col-md-1.glyphicon-minus-sign', function() {
  const $api = $(this).closest('.api');
  $api.addClass('unsaved');
  $(this)
    .closest('li')
    .remove();
});

$main.on('click', '.remove', function() {
  let r = confirm('delete?');
  if (r) {
    // console.log('========= yes');
    let $api = $(this).closest('.api');
    let name = $api.find('.name b').text();
    $.ajax({
      type: 'post',
      dataType: 'json',
      url: '/admin/remove',
      contentType: 'application/json',
      data: JSON.stringify({ name }),
      success: function(o) {
        console.log(o);
        $api.remove();
      },
    });
  }
});

$main.on('click', 'button[data-toggle="collapse"]', function() {
  const $api = $(this).closest('.api');
  var clps = $api.find('button[data-toggle="collapse"]');
  if (clps.hasClass('glyphicon-chevron-down')) {
    clps.removeClass('glyphicon-chevron-down');
    clps.addClass('glyphicon-chevron-up');
  } else {
    clps.removeClass('glyphicon-chevron-up');
    clps.addClass('glyphicon-chevron-down');
  }
});

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

$main.on('input', ':input', function() {
  const $api = $(this).closest('.api');
  $api.addClass('unsaved');
});

// validation
$main.on('change', '.order input', function() {
  if (!/\d+/.test($(this).val())) {
    $(this).addClass('error');
  } else {
    $(this).removeClass('error');
  }
});

$main.on('change', '.path input', function() {
  if (!/^\/\S/.test($(this).val())) {
    $(this).addClass('error');
  } else {
    $(this).removeClass('error');
  }
});

$main.on('change', '.targets .col-md-5', function() {
  if (!/^http(s|):\/\/\S+/.test($(this).val())) {
    $(this).addClass('error');
  } else {
    $(this).removeClass('error');
  }
});

$main.on('input', 'select', function() {
  let v = $(this).val();
  if (v == 1) {
    $(this).addClass('good');
    $(this).removeClass('ban');
    $(this).removeClass('bad');
  } else if (v == 0) {
    $(this).addClass('ban');
    $(this).removeClass('good');
    $(this).removeClass('bad');
  } else if (v == -1) {
    $(this).addClass('bad');
    $(this).removeClass('good');
    $(this).removeClass('ban');
  }
});
