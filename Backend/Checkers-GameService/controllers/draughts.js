module.exports = class Draughts {
  constructor(fen) {
    this.BLACK = 'B';
    this.WHITE = 'W';
    // this.EMPTY = -1
    this.MAN = 'b';
    this.KING = 'w';
    this.SYMBOLS = 'bwBW';
    this.DEFAULT_FEN = 'W:W31-50:B1-20';
    this.position = '';
    this.DEFAULT_POSITION_INTERNAL = '-bbbbbbbbbb-bbbbbbbbbb-0000000000-wwwwwwwwww-wwwwwwwwww-';
    this.DEFAULT_POSITION_EXTERNAL = 'Wbbbbbbbbbbbbbbbbbbbb0000000000wwwwwwwwwwwwwwwwwwww';
    this.STEPS = {
      NE: -5, SE: 6, SW: 5, NW: -6,
    };
    this.POSSIBLE_RESULTS = ['2-0', '0-2', '1-1', '0-0', '*', '1-0', '0-1'];
    this.FLAGS = {
      NORMAL: 'n',
      CAPTURE: 'c',
      PROMOTION: 'p',
    };

    this.UNICODES = {
      w: '\u26C0',
      b: '\u26C2',
      B: '\u26C3',
      W: '\u26C1',
      0: '\u0020\u0020',
    };

    this.SIGNS = {
      n: '-',
      c: 'x',
    };
    this.BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      PROMOTION: 4,
    };

    this.turn = this.WHITE;
    this.moveNumber = 1;
    this.history = [];
    this.header = {};

    if (!fen) {
      this.position = this.DEFAULT_POSITION_INTERNAL;
      this.load(this.DEFAULT_FEN);
    } else {
      this.position = this.DEFAULT_POSITION_INTERNAL;
      this.load(fen);
    }
  }

  clear() {
    this.position = this.DEFAULT_POSITION_INTERNAL;
    this.turn = this.WHITE;
    this.moveNumber = 1;
    this.history = [];
    this.header = {};
    this.update_setup(this.generate_fen());
  }

  reset() {
    this.load(this.DEFAULT_FEN);
  }

  change_turn() {
    this.turn = this.swap_color(this.turn);
  }

  load(fen) {
    // TODO for default fen
    if (!fen || fen === this.DEFAULT_FEN) {
      this.position = this.DEFAULT_POSITION_INTERNAL;
      this.update_setup(this.generate_fen(this.position));
      return true;
    }
    // fen_constants(dimension) //TODO for empty fens

    const checkedFen = this.validate_fen(fen);
    if (!checkedFen.valid) {
      console.error('Fen Error', fen, checkedFen);
      return false;
    }

    this.clear();

    // remove spaces
    fen = fen.replace(/\s+/g, '');
    // remove suffixes
    fen.replace(/\..*$/, '');

    const tokens = fen.split(':');
    // which side to move
    this.turn = tokens[0].substr(0, 1);

    // var positions = new Array()
    let externalPosition = this.DEFAULT_POSITION_EXTERNAL;
    for (var i = 1; i <= externalPosition.length; i++) {
      externalPosition = this.setCharAt(externalPosition, i, 0);
    }
    externalPosition = this.setCharAt(externalPosition, 0, this.turn);
    // TODO refactor
    for (let k = 1; k <= 2; k++) {
      // TODO called twice
      const color = tokens[k].substr(0, 1);
      const sideString = tokens[k].substr(1);
      if (sideString.length === 0) continue;
      const numbers = sideString.split(',');
      for (i = 0; i < numbers.length; i++) {
        let numSquare = numbers[i];
        const isKing = (numSquare.substr(0, 1) === 'K');
        numSquare = (isKing === true ? numSquare.substr(1) : numSquare); // strip K
        const range = numSquare.split('-');
        if (range.length === 2) {
          const from = parseInt(range[0], 10);
          const to = parseInt(range[1], 10);
          for (let j = from; j <= to; j++) {
            externalPosition = this.setCharAt(externalPosition, j, (isKing === true ? color.toUpperCase() : color.toLowerCase()));
          }
        } else {
          numSquare = parseInt(numSquare, 10);
          externalPosition = this.setCharAt(externalPosition, numSquare, (isKing === true ? color.toUpperCase() : color.toLowerCase()));
        }
      }
    }

    this.position = this.convertPosition(externalPosition, 'internal');
    this.update_setup(this.generate_fen(this.position));

    return true;
  }

  swap_color(c) {
    return c === this.WHITE ? this.BLACK : this.WHITE;
  }

  validate_fen(fen) {
    const errors = [
      {
        code: 0,
        message: 'no errors',
      },
      {
        code: 1,
        message: 'fen position not a string',
      },
      {
        code: 2,
        message: 'fen position has not colon at second position',
      },
      {
        code: 3,
        message: 'fen position has not 2 colons',
      },
      {
        code: 4,
        message: 'side to move of fen position not valid',
      },
      {
        code: 5,
        message: 'color(s) of sides of fen position not valid',
      },
      {
        code: 6,
        message: 'squares of fen position not integer',
      },
      {
        code: 7,
        message: 'squares of fen position not valid',
      },
      {
        code: 8,
        message: 'empty fen position',
      },
    ];

    if (typeof fen !== 'string') {
      return { valid: false, error: errors[0], fen };
    }

    fen = fen.replace(/\s+/g, '');

    if (fen === 'B::' || fen === 'W::' || fen === '?::') {
      return { valid: true, fen: `${fen}:B:W` }; // exception allowed i.e. empty fen
    }
    fen = fen.trim();
    fen = fen.replace(/\..*$/, '');

    if (fen === '') {
      return { valid: false, error: errors[7], fen };
    }

    if (fen.substr(1, 1) !== ':') {
      return { valid: false, error: errors[1], fen };
    }

    // fen should be 3 sections separated by colons
    const parts = fen.split(':');
    if (parts.length !== 3) {
      return { valid: false, error: errors[2], fen };
    }

    //  which side to move
    const turnColor = parts[0];
    if (turnColor !== 'B' && turnColor !== 'W' && turnColor !== '?') {
      return { valid: false, error: errors[3], fen };
    }

    // check colors of both sides
    const colors = parts[1].substr(0, 1) + parts[2].substr(0, 1);
    if (colors !== 'BW' && colors !== 'WB') {
      return { valid: false, error: errors[4], fen };
    }

    // check parts for both sides
    for (let k = 1; k <= 2; k += 1) {
      const sideString = parts[k].substr(1); // Stripping color
      if (sideString.length === 0) {
        continue;
      }
      const numbers = sideString.split(',');
      for (let i = 0; i < numbers.length; i++) {
        let numSquare = numbers[i];
        const isKing = (numSquare.substr(0, 1) === 'K');
        numSquare = (isKing === true ? numSquare.substr(1) : numSquare);
        const range = numSquare.split('-');
        if (range.length === 2) {
          if (this.isInteger(range[0]) === false) {
            return {
              valid: false, error: errors[5], fen, range: range[0],
            };
          }
          if (!(range[0] >= 1 && range[0] <= 100)) {
            return { valid: false, error: errors[6], fen };
          }
          if (this.isInteger(range[1]) === false) {
            return { valid: false, error: errors[5], fen };
          }
          if (!(range[1] >= 1 && range[1] <= 100)) {
            return { valid: false, error: errors[6], fen };
          }
        } else {
          if (this.isInteger(numSquare) === false) {
            return { valid: false, error: errors[5], fen };
          }
          if (!(numSquare >= 1 && numSquare <= 100)) {
            return { valid: false, error: errors[6], fen };
          }
        }
      }
    }

    return { valid: true, error_number: 0, error: errors[0] };
  }

  generate_fen() {
    const black = [];
    const white = [];
    const externalPosition = this.convertPosition(this.position, 'external');
    for (let i = 0; i < externalPosition.length; i++) {
      switch (externalPosition[i]) {
        case 'w':
          white.push(i);
          break;
        case 'W':
          white.push(`K${i}`);
          break;
        case 'b':
          black.push(i);
          break;
        case 'B':
          black.push(`K${i}`);
          break;
        default:
          break;
      }
    }
    return `${this.turn.toUpperCase()}:W${white.join(',')}:B${black.join(',')}`;
  }

  update_setup(fen) {
    if (this.history.length > 0) {
      return false;
    }
    if (fen !== this.DEFAULT_FEN) {
      this.header.SetUp = '1';
      this.header.FEN = fen;
    } else {
      delete this.header.SetUp;
      delete this.header.FEN;
    }
  }

  getMoveObject(move) {
    // TODO move flags for both capture and promote??
    const tempMove = {};
    const matches = move.split(/[x|-]/);
    tempMove.from = parseInt(matches[0], 10);
    tempMove.to = parseInt(matches[1], 10);
    const moveType = move.match(/[x|-]/)[0];
    if (moveType === '-') {
      tempMove.flags = this.FLAGS.NORMAL;
    } else {
      tempMove.flags = this.FLAGS.CAPTURE;
    }
    tempMove.piece = position.charAt(this.convertNumber(tempMove.from, 'internal'));
    let moves = this.getLegalMoves(tempMove.from);
    moves = this.convertMoves(moves, 'external');
    // if move legal then make move
    for (let i = 0; i < moves.length; i += 1) {
      if (tempMove.to === moves[i].to && tempMove.from === moves[i].from) {
        if (moves[i].takes.length > 0) {
          tempMove.flags = this.FLAGS.CAPTURE;
          tempMove.captures = moves[i].takes;
          tempMove.takes = moves[i].takes;
          tempMove.piecesCaptured = moves[i].piecesTaken;
        }
        return tempMove;
      }
    }
    console.log(moves, tempMove);
    return false;
  }

  makeMove(move) {
    move.piece = this.position.charAt(this.convertNumber(move.from, 'internal'));
    this.position = this.setCharAt(this.position, this.convertNumber(move.to, 'internal'), move.piece);
    this.position = this.setCharAt(this.position, this.convertNumber(move.from, 'internal'), 0);
    move.flags = this.FLAGS.NORMAL;
    // TODO refactor to either takes or capture
    if (move.takes && move.takes.length) {
      move.flags = this.FLAGS.CAPTURE;
      move.captures = move.takes;
      move.piecesCaptured = move.piecesTaken;
      for (let i = 0; i < move.takes.length; i++) {
        this.position = this.setCharAt(this.position, this.convertNumber(move.takes[i], 'internal'), 0);
      }
    }
    // Promoting piece here
    if (move.to <= 5 && move.piece === 'w') {
      move.flags = this.FLAGS.PROMOTION;
      this.position = this.setCharAt(this.position, this.convertNumber(move.to, 'internal'), move.piece.toUpperCase());
    } else if (move.to >= 46 && move.piece === 'b') {
      this.position = this.setCharAt(this.position, this.convertNumber(move.to, 'internal'), move.piece.toUpperCase());
    }
    this.push(move);
    if (this.turn === this.BLACK) {
      this.moveNumber += 1;
    }
    this.turn = this.swap_color(this.turn);
  }

  get(square) {
    const piece = this.position.charAt(this.convertNumber(square, 'internal'));
    return piece;
  }

  put(piece, square) {
    // check for valid piece string
    if (this.SYMBOLS.match(piece) === null) {
      return false;
    }

    // check for valid square
    if (this.outsideBoard(this.convertNumber(square, 'internal')) === true) {
      return false;
    }
    this.position = this.setCharAt(this.position, this.convertNumber(square, 'internal'), piece);
    this.update_setup(this.generate_fen());

    return true;
  }

  remove(square) {
    const piece = get(square);
    this.position = this.setCharAt(this.position, this.convertNumber(square, 'internal'), 0);
    this.update_setup(this.generate_fen());

    return piece;
  }

  fen() {
    return this.generate_fen();
  }

  generate_moves(square) {
    let moves = [];

    if (square) {
      moves = this.getLegalMoves(square);
    } else {
      const tempCaptures = this.getCaptures();
      // TODO change to be applicable to array
      if (tempCaptures.length) {
        for (let i = 0; i < tempCaptures.length; i++) {
          tempCaptures[i].flags = this.FLAGS.CAPTURE;
          tempCaptures[i].captures = tempCaptures[i].jumps;
          tempCaptures[i].piecesCaptured = tempCaptures[i].piecesTaken;
        }
        return tempCaptures;
      }
      moves = this.getMoves();
    }
    // TODO returns [] for on hovering for square no
    moves = [].concat.apply([], moves);
    return moves;
  }

  getLegalMoves(index) {
    let legalMoves;
    index = parseInt(index, 10);
    if (!Number.isNaN(index)) {
      index = this.convertNumber(index, 'internal');

      let captures = this.capturesAtSquare(index, { position: this.position, dirFrom: '' }, { jumps: [index], takes: [], piecesTaken: [] });

      captures = this.longestCapture(captures);
      legalMoves = captures;
      if (captures.length === 0) {
        legalMoves = this.movesAtSquare(index);
      }
    }
    // TODO called on hover ??
    return this.convertMoves(legalMoves, 'external');
  }

  getMoves(index) {
    let moves = [];
    const us = this.turn;

    for (let i = 1; i < this.position.length; i++) {
      if (this.position[i] === us || this.position[i] === us.toLowerCase()) {
        const tempMoves = this.movesAtSquare(i);
        if (tempMoves.length) {
          moves = moves.concat(this.convertMoves(tempMoves, 'external'));
        }
      }
    }
    return moves;
  }

  setCharAt(position, idx, chr) {
    idx = parseInt(idx, 10);
    if (idx > position.length - 1) {
      return position.toString();
    }
    return position.substr(0, idx) + chr + position.substr(idx + 1);
  }

  movesAtSquare(square) {
    const moves = [];
    const posFrom = square;
    const piece = this.position.charAt(posFrom);
    // console.trace(piece, square, 'movesAtSquare')
    switch (piece) {
      case 'b':
      case 'w':
        var dirStrings = this.directionStrings(this.position, posFrom, 2);
        for (var dir in dirStrings) {
          var str = dirStrings[dir];

          var matchArray = str.match(/^[bw]0/); // e.g. b0 w0
          if (matchArray !== null && this.validDir(piece, dir) === true) {
            var posTo = posFrom + this.STEPS[dir];
            var moveObject = {
              from: posFrom, to: posTo, takes: [], jumps: [],
            };
            moves.push(moveObject);
          }
        }
        break;
      case 'W':
      case 'B':
        dirStrings = this.directionStrings(this.position, posFrom, 2);
        for (dir in dirStrings) {
          str = dirStrings[dir];

          matchArray = str.match(/^[BW]0+/); // e.g. B000, W0
          if (matchArray !== null) {
            for (let i = 1; i < matchArray[0].length; i++) {
              posTo = posFrom + (i * this.STEPS[dir]);
              moveObject = {
                from: posFrom, to: posTo, takes: [], jumps: [],
              };
              moves.push(moveObject);
            }
          }
        }
        break;
      default:
        return moves;
    }
    return moves;
  }

  getCaptures() {
    const us = this.turn;
    let captures = [];
    for (let i = 0; i < this.position.length; i++) {
      if (this.position[i] === us || this.position[i] === us.toLowerCase()) {
        const posFrom = i;
        const state = { position: this.position, dirFrom: '' };
        const capture = {
          jumps: [], takes: [], from: posFrom, to: '', piecesTaken: [],
        };
        capture.jumps[0] = posFrom;
        const tempCaptures = this.capturesAtSquare(posFrom, state, capture);
        if (tempCaptures.length) {
          captures = captures.concat(this.convertMoves(tempCaptures, 'external'));
        }
      }
    }
    captures = this.longestCapture(captures);
    return captures;
  }

  capturesAtSquare(posFrom, state, capture) {
    const piece = state.position.charAt(posFrom);
    if (piece !== 'b' && piece !== 'w' && piece !== 'B' && piece !== 'W') {
      return [capture];
    }
    let dirString;
    if (piece === 'b' || piece === 'w') {
      dirString = this.directionStrings(state.position, posFrom, 3);
    } else {
      dirString = this.directionStrings(state.position, posFrom);
    }
    let finished = true;
    let captureArrayForDir = {};
    for (var dir in dirString) {
      if (dir === state.dirFrom) {
        continue;
      }
      const str = dirString[dir];
      switch (piece) {
        case 'b':
        case 'w':
          var matchArray = str.match(/^b[wW]0|^w[bB]0/); // matches: bw0, bW0, wB0, wb0
          if (matchArray !== null) {
            var posTo = posFrom + (2 * this.STEPS[dir]);
            var posTake = posFrom + (1 * this.STEPS[dir]);
            if (capture.takes.indexOf(posTake) > -1) {
              continue; // capturing twice forbidden
            }
            var updateCapture = this.clone(capture);
            updateCapture.to = posTo;
            updateCapture.jumps.push(posTo);
            updateCapture.takes.push(posTake);
            updateCapture.piecesTaken.push(this.position.charAt(posTake));
            updateCapture.from = posFrom;
            var updateState = this.clone(state);
            updateState.dirFrom = this.oppositeDir(dir);
            var pieceCode = updateState.position.charAt(posFrom);
            updateState.position = this.setCharAt(updateState.position, posFrom, 0);
            updateState.position = this.setCharAt(updateState.position, posTo, pieceCode);
            finished = false;
            captureArrayForDir[dir] = this.capturesAtSquare(posTo, updateState, updateCapture);
          }
          break;
        case 'B':
        case 'W':
          matchArray = str.match(/^B0*[wW]0+|^W0*[bB]0+/); // matches: B00w000, WB00
          if (matchArray !== null) {
            const matchStr = matchArray[0];
            const matchArraySubstr = matchStr.match(/[wW]0+$|[bB]0+$/); // matches: w000, B00
            const matchSubstr = matchArraySubstr[0];
            const takeIndex = matchStr.length - matchSubstr.length;
            posTake = posFrom + (takeIndex * this.STEPS[dir]);
            if (capture.takes.indexOf(posTake) > -1) {
              continue;
            }
            for (let i = 1; i < matchSubstr.length; i++) {
              posTo = posFrom + ((takeIndex + i) * this.STEPS[dir]);
              updateCapture = this.clone(capture);
              updateCapture.jumps.push(posTo);
              updateCapture.to = posTo;
              updateCapture.takes.push(posTake);
              updateCapture.piecesTaken.push(this.position.charAt(posTake));
              updateCapture.posFrom = posFrom;
              updateState = this.clone(state);
              updateState.dirFrom = this.oppositeDir(dir);
              pieceCode = updateState.position.charAt(posFrom);
              updateState.position = this.setCharAt(updateState.position, posFrom, 0);
              updateState.position = this.setCharAt(updateState.position, posTo, pieceCode);
              finished = false;
              const dirIndex = dir + i.toString();
              captureArrayForDir[dirIndex] = this.capturesAtSquare(posTo, updateState, updateCapture);
            }
          }
          break;
        default:
          captureArrayForDir = [];
      }
    }
    let captureArray = [];
    if (finished === true && capture.takes.length) {
      // fix for mutiple capture
      capture.from = capture.jumps[0];
      captureArray[0] = capture;
    } else {
      for (dir in captureArrayForDir) {
        captureArray = captureArray.concat(captureArrayForDir[dir]);
      }
    }
    return captureArray;
  }

  push(move) {
    this.history.push({
      move,
      turn: this.turn,
      moveNumber: this.moveNumber,
    });
  }

  history() {
    return this.getHistory();
  }

  isInteger(int) {
    const regex = /^\d+$/;
    if (regex.test(int)) {
      return true;
    }
    return false;
  }

  longestCapture(captures) {
    let maxJumpCount = 0;
    for (var i = 0; i < captures.length; i++) {
      const jumpCount = captures[i].jumps.length;
      if (jumpCount > maxJumpCount) {
        maxJumpCount = jumpCount;
      }
    }

    const selectedCaptures = [];
    if (maxJumpCount < 2) {
      return selectedCaptures;
    }

    for (i = 0; i < captures.length; i++) {
      if (captures[i].jumps.length === maxJumpCount) {
        selectedCaptures.push(captures[i]);
      }
    }
    return selectedCaptures;
  }

  convertMoves(moves, type) {
    const tempMoves = [];
    if (!type || moves.length === 0) {
      return tempMoves;
    }
    for (let i = 0; i < moves.length; i++) {
      const moveObject = { jumps: [], takes: [] };
      moveObject.from = this.convertNumber(moves[i].from, type);
      for (var j = 0; j < moves[i].jumps.length; j++) {
        moveObject.jumps[j] = this.convertNumber(moves[i].jumps[j], type);
      }
      for (j = 0; j < moves[i].takes.length; j++) {
        moveObject.takes[j] = this.convertNumber(moves[i].takes[j], type);
      }
      moveObject.to = this.convertNumber(moves[i].to, type);
      moveObject.piecesTaken = moves[i].piecesTaken;
      tempMoves.push(moveObject);
    }
    return tempMoves;
  }

  convertNumber(number, notation) {
    const num = parseInt(number, 10);
    let result;
    switch (notation) {
      case 'internal':
        result = num + Math.floor((num - 1) / 10);
        break;
      case 'external':
        result = num - Math.floor((num - 1) / 11);
        break;
      default:
        result = num;
    }
    return result;
  }

  convertPosition(position, notation) {
    let sub1; let sub2; let sub3; let sub4; let sub5; let
      newPosition;
    switch (notation) {
      case 'internal':
        sub1 = position.substr(1, 10);
        sub2 = position.substr(11, 10);
        sub3 = position.substr(21, 10);
        sub4 = position.substr(31, 10);
        sub5 = position.substr(41, 10);
        newPosition = `-${sub1}-${sub2}-${sub3}-${sub4}-${sub5}-`;
        break;
      case 'external':
        sub1 = position.substr(1, 10);
        sub2 = position.substr(12, 10);
        sub3 = position.substr(23, 10);
        sub4 = position.substr(34, 10);
        sub5 = position.substr(45, 10);
        newPosition = `?${sub1}${sub2}${sub3}${sub4}${sub5}`;
        break;
      default:
        newPosition = position;
    }
    return newPosition;
  }

  outsideBoard(square) {
    // internal notation only
    const n = parseInt(square, 10);
    if (n >= 0 && n <= 55 && (n % 11) !== 0) {
      return false;
    }
    return true;
  }

  directionStrings(tempPosition, square, maxLength) {
    // Create direction strings for square at position (internal representation)
    // Output object with four directions as properties (four rhumbs).
    // Each property has a string as value representing the pieces in that direction.
    // Piece of the given square is part of each string.
    // Example of output: {NE: 'b0', SE: 'b00wb00', SW: 'bbb00', NW: 'bb'}
    // Strings have maximum length of given maxLength.
    if (arguments.length === 2) {
      maxLength = 100;
    }
    const dirStrings = {};
    if (this.outsideBoard(square) === true) {
      return 334;
    }

    for (const dir in this.STEPS) {
      const dirArray = [];
      let i = 0;
      let index = square;
      do {
        dirArray[i] = tempPosition.charAt(index);
        i++;
        index = square + i * this.STEPS[dir];
        var outside = this.outsideBoard(index);
      } while (outside === false && i < maxLength);

      dirStrings[dir] = dirArray.join('');
    }

    return dirStrings;
  }

  oppositeDir(direction) {
    const opposite = {
      NE: 'SW', SE: 'NW', SW: 'NE', NW: 'SE',
    };
    return opposite[direction];
  }

  validDir(piece, dir) {
    const validDirs = {};
    validDirs.w = {
      NE: true, SE: false, SW: false, NW: true,
    };
    validDirs.b = {
      NE: false, SE: true, SW: true, NW: false,
    };
    return validDirs[piece][dir];
  }

  ascii(unicode) {
    const extPosition = this.convertPosition(this.position, 'external');
    let s = '\n+-------------------------------+\n';
    let i = 1;
    for (let row = 1; row <= 10; row++) {
      s += '|\t';
      if (row % 2 !== 0) {
        s += '  ';
      }
      for (let col = 1; col <= 10; col++) {
        if (col % 2 === 0) {
          s += '  ';
          i++;
        } else if (unicode) {
          s += ` ${this.UNICODES[extPosition[i]]}`;
        } else {
          s += ` ${extPosition[i]}`;
        }
      }
      if (row % 2 === 0) {
        s += '  ';
      }
      s += '\t|\n';
    }
    s += '+-------------------------------+\n';
    return s;
  }

  gameOver() {
    // First check if any piece left
    for (let i = 0; i < this.position.length; i++) {
      if (this.position[i].toLowerCase() === this.turn.toLowerCase()) {
        // if moves left game not over
        return this.generate_moves().length === 0;
      }
    }
    return true;
  }

  getHistory(options) {
    const tempHistory = this.clone(this.history);
    const moveHistory = [];
    const verbose = (typeof options !== 'undefined' && 'verbose' in options && options.verbose);
    while (tempHistory.length > 0) {
      const move = tempHistory.shift();
      if (verbose) {
        moveHistory.push(this.makePretty(move));
      } else {
        moveHistory.push(move.move.from + SIGNS[move.move.flags] + move.move.to);
      }
    }
    return moveHistory;
  }

  getPosition() {
    return convertPosition(this.position, 'external');
  }

  makePretty(uglyMove) {
    const move = {};
    move.from = uglyMove.move.from;
    move.to = uglyMove.move.to;
    move.flags = uglyMove.move.flags;
    move.moveNumber = uglyMove.moveNumber;
    move.piece = uglyMove.move.piece;
    if (move.flags === 'c') {
      move.captures = uglyMove.move.captures.join(',');
    }
    return move;
  }

  clone(obj) {
    const dupe = JSON.parse(JSON.stringify(obj));
    return dupe;
  }

  trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  header() {
    return this.set_header(this.arguments);
  }

  turn() {
    return this.turn.toLowerCase();
  }

  move(move) {
    if (typeof move.to === 'undefined' && typeof move.from === 'undefined') {
      console.log('UNDEDFINED MOVE');
      return false;
    }
    move.to = parseInt(move.to, 10);
    move.from = parseInt(move.from, 10);
    const moves = this.generate_moves();
    for (let i = 0; i < moves.length; i++) {
      if ((move.to === moves[i].to) && (move.from === moves[i].from)) {
        this.makeMove(moves[i]);
        return moves[i];
      }
    }
    console.log('ITS FALSE');
    return false;
  }
};
