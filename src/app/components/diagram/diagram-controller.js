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
      $log.log("post Link", vm.logEntries);
      _refresh();
    }

    function _refresh() {
      $log.log("refresh diagram", vm.logEntries);

      if(!vm.logEntries || vm.logEntries.length == 0) {
        $log.log("no log entries", vm.logEntries);
        return;
      }

      // TODO: remove this filter for temperature values
      vm.logEntries = vm.logEntries.filter(function(entry) {
        return ["{6013402f-b5b1-46b3-8490-f0c20d62fe61}", "{14ec2781-cb04-4bbf-b097-7d01ef982630}", "{fefe5563-452f-4833-b5cf-49c3cc67c772}"].indexOf(entry.typeId) > -1;
      });

      var svg = d3.select($element[0]).select("svg");
      var margin = {top: 20, right: 80, bottom: 30, left: 50};
      var width = svg.attr("width") - margin.left - margin.right;
      var height = svg.attr("height") - margin.top - margin.bottom;
      var graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // scale styles
      var x = d3.scaleTime()
        .rangeRound([0, width]);

      var y = d3.scaleLinear()
        .rangeRound([height, 0]);

      var z = d3.scaleOrdinal(d3.schemeCategory10);

      var line = d3.line()
        .x(function(d) {
          return x(new Date(d.timestamp));
        })
        .y(function(d) {
          if(isNaN(+d.value)) {
            return 0;
          }
          return y(+d.value);
        });

      var groupedData = d3.nest()
        .key(function(d) {return d.typeId;})
        .entries(vm.logEntries);

      x.domain(d3.extent(vm.logEntries, function(d) {
        return new Date(d.timestamp);
      }));

      y.domain([
        d3.min(vm.logEntries, function(c) { return (isNaN(+c.value)) ? 0 : +c.value}),
        d3.max(vm.logEntries, function(c) { return (isNaN(+c.value)) ? 0 : +c.value})
      ]);

      $log.log("grouped Data: before z domain ", groupedData);

      z.domain(groupedData.map(function(c) { $log.log(c.key, c); return c.key; }));

      graph.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      graph.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .style("text-anchor", "end")
        .text("Temperature (°C)");

      var temperature = graph.selectAll(".temperature")
        .data(groupedData)
        .enter().append("g")
        .attr("class", "temperature");

      temperature.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.key); });

      $log.log("grouped data: ", groupedData);

      $log.log("refresh finished!");

    }

    function $onChanges(changesObj) {
      $log.log("Change Diagram", vm.logEntries, changesObj, changesObj.logEntries.isFirstChange());
      _refresh();
    }

    function refetch() {
      $log.log("before refetch Diagram", vm.logEntries);
      vm.onRefetch();
      $log.log("after refetch Diagram", vm.logEntries);
    }
  }

}());
