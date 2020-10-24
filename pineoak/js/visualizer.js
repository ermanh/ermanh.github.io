var visualizer = Vue.component('visualizer', {
    name: 'visualizer',
    template: `
        <div class="page-container">
            <div class="banner">
                <div id="logo">
                    <a href="http://pineoak.ermanh.com">
                    <span id="pine">Pine</span><span id="oak">Oak</span>
                    <span id="viz">- VIZ</span>
                    </a>
                </div>
                <div class="banner-elem">
                    <span>Mini Wiyot Database</span>
                </div>
            </div>
            <div class="content-container">
                <div id="sentences-container">
                    <ul id="sentences-list"></ul>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            showModal: false,
            msg: 'PineOak Sentences',
            conll: conll,
            sentenceAlignments: [ // must be queried separately
                { _from: '1_wiy', _to: '1_eng', _key: 'sa1' }
            ],
            drawConfig: {
                mainSentenceHeight: 25,
                firstDeprelHeight: 35,
                singleDeprelHeight: 23,
                singleLineHeight: 20,
                nextLineStart: 23,
                lineWordProperties: 2,
                widthBetweenWords: 10,
                alignmentsHeight: 80,
                treetopSpace: 10,
                fontSpec: '1.75em Avenir',
                tagFontSpec: 'normal 10pt Avenir',
                deprelFontSpec: '14px Arial',
                deprelTextHeight: 10,
                deprelBoxRadius: 2,
                textColor: 'var(--acorn-gray-D1)',
                tagColor: '#2a6596' // darker steelblue
            },
        };
    },
    computed: {
        sentences: function () {
            return conllToJson(this.conll);
        }
    },
    mounted: function () {
        drawD3(this.sentences, this.drawConfig);

        this.enableHover();
        this.enableClicked();

        console.log('Everything mounted!');
    },
    methods: {
        createPath: function (name) {
            return name.replace(/ /g, '-');
        },
        onSubmit: function () {
            this.form.submit('post', 'sentences')
                .then(function (data) {
                    alert('Handling it!');
                    data.path = this.createPath(data.name);
                    this.projects.push(data);
                    this.showModal = false;
                })
                .catch(function (err) { alert(err); });
        },
        enableHover: function () {
            // Word Group and Alignments hover-highlighting
            d3.selectAll('g.wordGroup')
                .on('mouseenter', function () {
                    d3.select(this).select('rect').classed('word-box-hover', true);
                    var _from = d3.select(this).attr('word-id');
                    var alignmentsFrom = d3.selectAll('.alignmentPath[_from="' + _from + '"]');
                    var alignmentsTo = d3.selectAll('.alignmentPath[_to="' + _from + '"]');
                    alignmentsFrom.classed('alignment-hover', true);
                    alignmentsTo.classed('alignment-hover', true);
                    alignmentsFrom.each(function (d, i) {
                        d3.select('g[word-id="' + d._to + '"]')
                            .select('rect').classed('word-box-hover', true);
                        d3.select('g[word-id="' + d._from + '"]')
                            .select('rect').classed('word-box-hover', true);
                        // reverse paths
                        d3.selectAll('.alignmentPath[_to="' + d._to + '"]')
                            .classed('alignment-hover', true);
                        // reverse aligned words
                        d3.selectAll('.alignmentPath[_to="' + d._to + '"]').each(function (d, i) {
                            d3.select('g[word-id="' + d._from + '"]')
                                .select('rect').classed('word-box-hover', true);
                        });
                    });
                    alignmentsTo.each(function (d, i) {
                        d3.select('g[word-id="' + d._to + '"]')
                            .select('rect').classed('word-box-hover', true);
                        d3.select('g[word-id="' + d._from + '"]')
                            .select('rect').classed('word-box-hover', true);
                        // reverse paths
                        d3.selectAll('.alignmentPath[_from="' + d._from + '"]')
                            .classed('alignment-hover', true);
                        // reverse aligned words
                        d3.selectAll('.alignmentPath[_from="' + d._from + '"]').each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]')
                                .select('rect').classed('word-box-hover', true);
                        });
                    });
                })
                .on('mouseleave', function () {
                    d3.select(this).select('rect').classed('word-box-hover', false);
                    var _from = d3.select(this).attr('word-id');
                    var alignmentsFrom = d3.selectAll('.alignmentPath[_from="' + _from + '"]');
                    var alignmentsTo = d3.selectAll('.alignmentPath[_to="' + _from + '"]');
                    alignmentsFrom.classed('alignment-hover', false);
                    alignmentsTo.classed('alignment-hover', false);
                    alignmentsFrom.each(function (d, i) {
                        d3.select('g[word-id="' + d._to + '"]')
                            .select('rect').classed('word-box-hover', false);
                        d3.select('g[word-id="' + d._from + '"]')
                            .select('rect').classed('word-box-hover', false);
                        // reverse paths
                        d3.selectAll('.alignmentPath[_to="' + d._to + '"]')
                            .classed('alignment-hover', false);
                        // reverse aligned words
                        d3.selectAll('.alignmentPath[_to="' + d._to + '"]').each(function (d, i) {
                            d3.select('g[word-id="' + d._from + '"]')
                                .select('rect').classed('word-box-hover', false);
                        });
                    });
                    alignmentsTo.each(function (d, i) {
                        d3.select('g[word-id="' + d._to + '"]')
                            .select('rect').classed('word-box-hover', false);
                        d3.select('g[word-id="' + d._from + '"]')
                            .select('rect').classed('word-box-hover', false);
                        // reverse paths
                        d3.selectAll('.alignmentPath[_from="' + d._from + '"]')
                            .classed('alignment-hover', false);
                        // reverse aligned words
                        d3.selectAll('.alignmentPath[_from="' + d._from + '"]').each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]')
                                .select('rect').classed('word-box-hover', false);
                        });
                    });
                });

            // Deprel hover-highlighting
            d3.selectAll('.deprelBox')
                .on('mouseenter', function () {
                    d3.select(this).classed('deprel-box-hover', true);
                    d3.select(this.parentNode).select('text').classed('deprel-text-hover', true);
                    d3.select(this.parentNode).select('.pathLine').classed('deprel-line-hover', true);
                    d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-hover', true);
                    var _from = d3.select(this.parentNode).attr('_from');
                    var _to = d3.select(this.parentNode).attr('_to');
                    var _fromNode = d3.select('g[word-id="' + _from + '"]');
                    var _toNode = d3.select('g[word-id="' + _to + '"]');
                    _fromNode.select('rect').classed('deprel-wordbox-hover', true);
                    _fromNode.select('text.word').classed('deprel-word-hover', true);
                    _fromNode.select('text.tag').classed('deprel-tag-hover', true);
                    _toNode.select('rect').classed('deprel-wordbox-hover', true);
                    _toNode.select('text.word').classed('deprel-word-hover', true);
                    _toNode.select('text.tag').classed('deprel-tag-hover', true);
                })
                .on('mouseleave', function () {
                    d3.select(this).classed('deprel-box-hover', false);
                    d3.select(this.parentNode).select('text').classed('deprel-text-hover', false);
                    d3.select(this.parentNode).select('.pathLine').classed('deprel-line-hover', false);
                    d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-hover', false);
                    var _from = d3.select(this.parentNode).attr('_from');
                    var _to = d3.select(this.parentNode).attr('_to');
                    var _fromNode = d3.select('g[word-id="' + _from + '"]');
                    var _toNode = d3.select('g[word-id="' + _to + '"]');
                    _fromNode.select('rect').classed('deprel-wordbox-hover', false);
                    _fromNode.select('text.word').classed('deprel-word-hover', false);
                    _fromNode.select('text.tag').classed('deprel-tag-hover', false);
                    _toNode.select('rect').classed('deprel-wordbox-hover', false);
                    _toNode.select('text.word').classed('deprel-word-hover', false);
                    _toNode.select('text.tag').classed('deprel-tag-hover', false);
                });
            d3.selectAll('.deprelText')
                .on('mouseenter', function () {
                    d3.select(this).classed('deprel-text-hover', true);
                    d3.select(this.parentNode).select('.deprelBox').classed('deprel-box-hover', true);
                    d3.select(this.parentNode).select('.pathLine').classed('deprel-line-hover', true);
                    d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-hover', true);
                    var _from = d3.select(this.parentNode).attr('_from');
                    var _to = d3.select(this.parentNode).attr('_to');
                    var _fromNode = d3.select('g[word-id="' + _from + '"]');
                    var _toNode = d3.select('g[word-id="' + _to + '"]');
                    _fromNode.select('rect').classed('deprel-wordbox-hover', true);
                    _fromNode.select('text.word').classed('deprel-word-hover', true);
                    _fromNode.select('text.tag').classed('deprel-tag-hover', true);
                    _toNode.select('rect').classed('deprel-wordbox-hover', true);
                    _toNode.select('text.word').classed('deprel-word-hover', true);
                    _toNode.select('text.tag').classed('deprel-tag-hover', true);
                })
                .on('mouseleave', function () {
                    d3.select(this).classed('deprel-text-hover', false);
                    d3.select(this.parentNode).select('.deprelBox').classed('deprel-box-hover', false);
                    d3.select(this.parentNode).select('.pathLine').classed('deprel-line-hover', false);
                    d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-hover', false);
                    var _from = d3.select(this.parentNode).attr('_from');
                    var _to = d3.select(this.parentNode).attr('_to');
                    var _fromNode = d3.select('g[word-id="' + _from + '"]');
                    var _toNode = d3.select('g[word-id="' + _to + '"]');
                    _fromNode.select('rect').classed('deprel-wordbox-hover', false);
                    _fromNode.select('text.word').classed('deprel-word-hover', false);
                    _fromNode.select('text.tag').classed('deprel-tag-hover', false);
                    _toNode.select('rect').classed('deprel-wordbox-hover', false);
                    _toNode.select('text.word').classed('deprel-word-hover', false);
                    _toNode.select('text.tag').classed('deprel-tag-hover', false);
                });
        },
        enableClicked: function () {
            // Word Group and Alignments click-highlighting
            d3.selectAll('g.wordGroup')
                .on('click', function () {
                    var clicked = d3.select(this).attr('clicked');
                    if (clicked === '0') {
                        d3.select(this).attr('clicked', '1');
                        d3.select(this).select('rect').classed('word-box-clicked', true);
                        d3.select(this).select('text.word').classed('word-text-clicked', true);
                        d3.select(this).select('text.tag').classed('word-tag-clicked', true);
                    } else if (clicked === '1') {
                        d3.select(this).attr('clicked', '2');
                        d3.select(this).select('rect').classed('word-box-clicked', true);
                        var _from = d3.select(this).attr('word-id');
                        var alignmentsFrom = d3.selectAll('.alignmentPath[_from="' + _from + '"]');
                        var alignmentsTo = d3.selectAll('.alignmentPath[_to="' + _from + '"]');
                        alignmentsFrom.classed('alignment-clicked', true);
                        alignmentsTo.classed('alignment-clicked', true);
                        alignmentsFrom.each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]').attr('clicked', '2');
                            d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', true);
                            d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', true);
                            d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').attr('clicked', '2');
                            d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', true);
                            // reverse paths
                            d3.selectAll('.alignmentPath[_to="' + d._to + '"]')
                                .classed('alignment-clicked', true);
                            // reverse aligned words
                            d3.selectAll('.alignmentPath[_to="' + d._to + '"]').each(function (d, i) {
                                d3.select('g[word-id="' + d._from + '"]').attr('clicked', '2');
                                d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', true);
                                d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', true);
                                d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', true);
                            });
                        });
                        alignmentsTo.each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]').attr('clicked', '2');
                            d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', true);
                            d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', true);
                            d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').attr('clicked', '2');
                            d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', true);
                            d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', true);
                            // reverse paths
                            d3.selectAll('.alignmentPath[_from="' + d._from + '"]')
                                .classed('alignment-clicked', true);
                            // reverse aligned words
                            d3.selectAll('.alignmentPath[_from="' + d._from + '"]').each(function (d, i) {
                                d3.select('g[word-id="' + d._to + '"]').attr('clicked', '2');
                                d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', true);
                                d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', true);
                                d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', true);
                            });
                        });
                    } else if (clicked === '2') {
                        d3.select(this).attr('clicked', '0');
                        d3.select(this).select('rect').classed('word-box-clicked', false);
                        d3.select(this).select('text.word').classed('word-text-clicked', false);
                        d3.select(this).select('text.tag').classed('word-tag-clicked', false);
                        var _from = d3.select(this).attr('word-id');
                        var alignmentsFrom = d3.selectAll('.alignmentPath[_from="' + _from + '"]');
                        var alignmentsTo = d3.selectAll('.alignmentPath[_to="' + _from + '"]');
                        alignmentsFrom.classed('alignment-clicked', false);
                        alignmentsTo.classed('alignment-clicked', false);
                        alignmentsFrom.each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]').attr('clicked', '0');
                            d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', false);
                            d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', false);
                            d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').attr('clicked', '0');
                            d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', false);
                            // reverse paths
                            d3.selectAll('.alignmentPath[_to="' + d._to + '"]')
                                .classed('alignment-clicked', false);
                            // reverse aligned words
                            d3.selectAll('.alignmentPath[_to="' + d._to + '"]').each(function (d, i) {
                                d3.select('g[word-id="' + d._from + '"]').attr('clicked', '0');
                                d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', false);
                                d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', false);
                                d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', false);
                            });
                        });
                        alignmentsTo.each(function (d, i) {
                            d3.select('g[word-id="' + d._to + '"]').attr('clicked', '0');
                            d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', false);
                            d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', false);
                            d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').attr('clicked', '0');
                            d3.select('g[word-id="' + d._from + '"]').select('rect').classed('word-box-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').select('text.word').classed('word-text-clicked', false);
                            d3.select('g[word-id="' + d._from + '"]').select('text.tag').classed('word-tag-clicked', false);
                            // reverse paths
                            d3.selectAll('.alignmentPath[_from="' + d._from + '"]')
                                .classed('alignment-clicked', false);
                            // reverse aligned words
                            d3.selectAll('.alignmentPath[_from="' + d._from + '"]').each(function (d, i) {
                                d3.select('g[word-id="' + d._to + '"]').attr('clicked', '0');
                                d3.select('g[word-id="' + d._to + '"]').select('rect').classed('word-box-clicked', false);
                                d3.select('g[word-id="' + d._to + '"]').select('text.word').classed('word-text-clicked', false);
                                d3.select('g[word-id="' + d._to + '"]').select('text.tag').classed('word-tag-clicked', false);
                            });
                        });
                    }
                });

            // Deprel click-highlighting
            d3.selectAll('.deprelBox')
                .on('click', function () {
                    var clicked = d3.select(this).attr('clicked');
                    if (clicked === '0') {
                        d3.select(this).attr('clicked', '1');
                        d3.select(this).classed('deprel-box-clicked', true);
                        d3.select(this.parentNode).select('text').classed('deprel-text-clicked', true);
                        d3.select(this.parentNode).select('.pathLine').classed('deprel-line-clicked', true);
                        d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-clicked', true);
                        // var _from = d3.select(this.parentNode).attr('_from')
                        // var _to = d3.select(this.parentNode).attr('_to')
                        // var _fromNode = d3.select('g[word-id="' + _from + '"]')
                        // var _toNode = d3.select('g[word-id="' + _to + '"]')
                        // _fromNode.select('rect').classed('deprel-wordbox-hover', true)
                        // _fromNode.select('text.word').classed('deprel-word-hover', true)
                        // _fromNode.select('text.tag').classed('deprel-tag-hover', true)
                        // _toNode.select('rect').classed('deprel-wordbox-hover', true)
                        // _toNode.select('text.word').classed('deprel-word-hover', true)
                        // _toNode.select('text.tag').classed('deprel-tag-hover', true)
                    } else {
                        d3.select(this).attr('clicked', '0');
                        d3.select(this).classed('deprel-box-clicked', false);
                        d3.select(this.parentNode).select('text').classed('deprel-text-clicked', false);
                        d3.select(this.parentNode).select('.pathLine').classed('deprel-line-clicked', false);
                        d3.select(this.parentNode).select('.pathArrow').classed('deprel-arrow-clicked', false);
                    }
                });
        }
    }
});
