/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2016 Daniel Ultsch <daniel.ultsch@guh.io>                             *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


(function() {
  'use strict';

  angular
    .module('guh.components')
    .controller('DiagramCtrl', DiagramCtrl);

  DiagramCtrl.$inject = ['$log', '$element'];

  /**
   * @ngdoc controller
   * @name guh.containers.controller:DiagramCtrl
   * @description Presentational component to show a diagram.
   *
   */
  function DiagramCtrl($log, $element) {

    var vm = this;
    vm.$onInit = $onInit;
    vm.$postLink = $postLink;
    vm.$onChanges = $onChanges;
    vm.refetch = refetch;

    function $onInit() {
      $log.log("Hello Diagram", vm.logEntries, vm);
    }

    function $postLink() {
      // var element = angular.element($element[0]);
      console.log($element[0]);

      var svg = d3.select($element[0]).select("svg");
      var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parseTime = d3.timeParse("%d-%b-%y");

      var x = d3.scaleTime()
        .rangeRound([0, width]);

      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      var line = d3.line()
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.close);
        });

      d3.tsv("data.tsv", function(d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
        return d;
      }, function(error, data) {
        if(error) throw error;

        x.domain(d3.extent(data, function(d) {
          return d.date;
        }));
        y.domain(d3.extent(data, function(d) {
          return d.close;
        }));

        g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y))
          .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .style("text-anchor", "end")
          .text("Price ($)");

        g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);
      });
    }

    function $onChanges(changesObj) {
      $log.log("Change Diagram", vm.logEntries, changesObj, changesObj.logEntries.isFirstChange());
    }

    function refetch() {
      $log.log("before refetch Diagram", vm.logEntries);
      vm.onRefetch();
      $log.log("after refetch Diagram", vm.logEntries);
    }
  }

}());
