(function () {
  "use strict";

  /**
   * PrGitGraph - inherits GitGraph
   *
   * @constructor
   *
   * @see GitGraph
   *
   * @this PrGitGraph
   **/
  function PrGitGraph(options) {
    GitGraph.call(this, options);
    this.pr_counter = 1;  // Pull Request counter
  };
  PrGitGraph.prototype = Object.create(GitGraph.prototype);
  PrGitGraph.prototype.constructor = PrGitGraph;

  /**
   * Create new branch - overloads GitGraph.Branch.branch()
   *
   * @see GitGraph.Branch.branch
   * @this PrGitGraph
   *
   * @return {PrBranch} New PrBranch
   **/
  // Overload method 'branch'
  PrGitGraph.prototype.branch = function (options) {
    // Options
    if (typeof options === "string") {
      var name = options;
      options = {};
      options.name = name;
    }

    options = _isObject(options) ? options : {};
    options.parent = this;
    options.parentBranch = options.parentBranch || this.HEAD;

    // Add branch
    var branch = new PrBranch(options);
    this.branches.push(branch);

    // Return
    return branch;
  };

  /**
   * Branch - inherits GitGraph.Branch
   *
   * @constructor
   *
   * @see GitGraph.Branch
   *
   * @this PrBranch
   **/
  function PrBranch(options) {
    GitGraph.Branch.call(this, options);
  };
  PrBranch.prototype = Object.create(GitGraph.Branch.prototype);
  PrBranch.prototype.constructor = PrBranch;

  /**
   * Create new branch - overloads GitGraph.Branch.branch()
   *
   * @see GitGraph.Branch.branch
   * @this PrBranch
   *
   * @return {PrBranch} New PrBranch
   **/
  PrBranch.prototype.branch = function (options) {
    // Options
    if (typeof options === "string") {
      var name = options;
      options = {};
      options.name = name;
    }

    options = _isObject(options) ? options : {};
    options.parent = this.parent;
    options.parentBranch = options.parentBranch || this;

    // Add branch
    var branch = new PrBranch(options);
    this.parent.branches.push(branch);

    // Return
    return branch;
  };

  /**
   * Merge branch and format commit message according to Pull Requests
   *
   * @param {Branch} [target = this.parent.HEAD]
   * @param {(string|object)} [commitOptions] - Options of commit
   *
   * @this PrBranch
   *
   * @return {PrBranch} this
   **/
  PrBranch.prototype.pr_merge = function (target, commitOptions) {
    var targetBranch = target || this.parent.HEAD;
    commitOptions = _isObject(commitOptions) ? commitOptions : {};
    commitOptions.message = "PR #" + this.parent.pr_counter++ + ": Merge branch `" + this.name + "` into `" + targetBranch.name + "`";
    commitOptions.dotSize = 8;
    commitOptions.dotStrokeWidth = 12;
    commitOptions.dotColor = "white";
    return this.merge(targetBranch, commitOptions);
  };

  /**
   * Create a dummy commit
   *
   * A commit created here uses a very small dotSize with commit message display disabled.
   * Use them when new branches start from the wrong parent commit.
   *
   * @this PrBranch
   *
   * @return {PrBranch} this
   **/
  PrBranch.prototype.dummy_commit = function () {
    return this.commit({ message: ".", messageDisplay: false, dotSize: 0.1 });
  }

  function _isObject(object) {
    return (typeof object === "object");
  }

  // Expose PrGitGraph object
  window.PrGitGraph = PrGitGraph;
  window.PrGitGraph.Branch = PrBranch;
})();