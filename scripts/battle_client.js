$(document).ready(function () {
  $.ajax('/board', { method: 'GET' }).done((data) => {
    console.log(data);
    renderBoard(data.myBoard, true);
    renderBoard(data.opBoard, false);
  });
  function getTheBoards (event) {
    $.ajax({ method: 'PUT', url: `/battle/${event.target.id}`, data: `${event.target.id}` })
      .done(() => {
        $.ajax('/board', { method: 'GET' }).done((data) => {
          console.log(data);
          renderBoard(data.myBoard, true);
          renderBoard(data.opBoard, false);
        });
      });
  }

  $('form').on('submit', function (event) {
    event.preventDefault();
    console.log(event.target.id);
    $.ajax({ method: 'PUT', url: `/battle/${event.target.id}`, data: `${event.target.id}` })
      .done(() => {
        $.ajax('/board', { method: 'GET' }).done((data) => {
          console.log(data);
        });
      });
  });
  // mine = true if no hover animation
  // cls = css classname 
  const renderBoard = (board, mine) => {
    $(`.${whom}-container`).empty();
    const whom = mine ? 'my' : 'op'; 
    $con = $(`.${whom}-container`)
    for (let row in board) {
      for (let col in board[row]) {
        const $newDiv = $('<div>').text(board[row][col]);
        $($newDiv).attr('id', `${row}${col}`);
        if (board[row][col] === 'X') $newDiv.addClass('hit-node');
        if (board[row][col] === 'O') $newDiv.addClass('miss-node');
        if (!mine) {
          $($newDiv).hover(function () {
            $(this).addClass('hover-op');
          }, function () {
            $(this).removeClass('hover-op');
          }
          );
          if (board[row][col] !== 'X' && board[row][col] !== 'O')
            $($newDiv).click((event) => getTheBoards(event)); 

        }
        $con.append($newDiv);
      }
    }
  };


})