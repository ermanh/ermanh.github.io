//export 

function conllToJson (raw) {
  if (raw === '' || !raw) return '';
  if (!raw.includes('-----')) return '';
  var cleaned = raw.replace(/\r/g, '').trim();
  cleaned = cleaned.replace(/\n{2,}/g, '\n\n');
  var split = cleaned.replace(/-{5,}[\w '"\\/_+-]+?-{5,}\n*/, '*%^%*').split('*%^%*');
  if (split[1].trim() === '') return '';
  var configs = split[0];
  var baseLang = configs.split('\n')[0].replace(/lang1 ?= ?/, '').trim();
  var parallelLang = configs.split('\n')[1].replace(/lang2 ?= ?/, '').trim();
  var sents = split[1].split('\n\n');
  sents = sents.map(function(sent) {
    return sent.split('\n');
  });
  sents = sents.map(function(sent) {
    var textID, sentID, language, order, sentence;
    var words = [];
    var deprels = [];
    var alignments = [];
    sent.forEach(function(item) {
      if (item.includes('# sent_id = ')) {
        sentID = item.replace(/# sent_id = /, '').trim();
        language = sentID.replace(/^.+\//, '');
        sentID = sentID.replace(/\/.+$/, '');
        textID = sentID.replace(/-.+$/, '');
        order = sentID.replace(/.+-/, '');
      } else if (item.includes('# text = ')) {
        sentence = item.replace(/# text = /, '').trim();
      } else {
        var itemArr = item.split('\t');
        var wordOrder = itemArr[0];
        var word = itemArr[1];
        var tag = itemArr[3];
        var headNum = itemArr[6] === '0' ? '_' : itemArr[6]; // temporary fix for head of 0 (root)
        var headID = sentID + '-' + language + '_' + headNum;
        var selfID = sentID + '-' + language + '_' + wordOrder;
        var deprel = itemArr[7];
        var alignedIDs = itemArr[9].split(',');
        alignedIDs = alignedIDs.map(function(id) {
          return id.replace(/\/(.+?)#/, '-$1_');
        });
        alignedIDs = alignedIDs.filter(function(id) { return id !== '_';});
        words.push({ _key: selfID, order: wordOrder, word: word, tag: tag });
        deprels.push({ _from: headID, _to: selfID, deprel: deprel });
        deprels = deprels.filter(function(deprel) { return !deprel._from.includes('__'); });
        alignedIDs.forEach(function(alignedID) {
          var _from = (language === baseLang) ? selfID : alignedID;
          var _to = (language === baseLang) ? alignedID : selfID;
          var alignedTextID = alignedID.replace(/-.+?-.+?_\d+$/, '');
          if (alignedTextID === textID) {
            alignments.push({ _from: _from, _to: _to });
          }
        });
      }
    });
    if ([baseLang, parallelLang].includes(language)) {
      return {
        language: language,
        textID: textID,
        _key: sentID,
        order: order,
        sentence: sentence,
        words: words,
        deprels: deprels,
        alignments: alignments
      };
    } else {
      return 'bad acorn';
    }
  });
  //
  //
  sents = sents.filter(function(sent) { return sent !== 'bad acorn'; });
  var newSentsObj = {};
  sents.forEach(function(sent) {
    var sentObj = { _key: sent._key, order: sent.order, sentence: sent.sentence, words: sent.words };
    if (!newSentsObj[sent.order]) {
      newSentsObj[sent.order] = {
        isEmpty: false,
        textId: sent.textID,
        wordAlignments: sent.alignments,
        deprels: sent.deprels,
        baseLang: baseLang,
        parallelLang: parallelLang
      };
      if (sent.language === baseLang) {
        newSentsObj[sent.order].baseSentence = sentObj;
      } else {
        newSentsObj[sent.order].parallelSentence = sentObj;
      }
    } else {
      newSentsObj[sent.order].wordAlignments = newSentsObj[sent.order].wordAlignments.concat(sent.alignments);
      newSentsObj[sent.order].deprels = newSentsObj[sent.order].deprels.concat(sent.deprels);
      if (sent.language === baseLang) {
        newSentsObj[sent.order].baseSentence = sentObj;
      } else {
        newSentsObj[sent.order].parallelSentence = sentObj;
      }
    }
  });
  // var keys = Object.keys(newSentsObj).sort((a, b) => parseInt(a) - parseInt(b));
  var keys = Object.keys(newSentsObj).sort(function (a, b) {
    return parseInt(a) - parseInt(b);
  });
  var newSents = keys.map(function (key) { return newSentsObj[key]; });
  newSents = newSents.map(function (sent) {
    var emptySentence = {
      isEmpty: true,
      _key: '',
      order: '',
      sentence: '',
      words: []
    };
    if (!sent.parallelSentence) sent.parallelSentence = emptySentence;
    if (!sent.baseSentence) sent.baseSentence = emptySentence;
    return sent;
  });
  return newSents;
}
