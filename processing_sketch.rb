
module Jekyll
  class PSketch < Liquid::Tag

    @path = nil

    @sketchid = nil
    @width = nil
    @height = nil

    def initialize(tag_name, text, tokens)
      super

      # The path we're getting the sketch from (a dir inside your jekyll dir)
      @path = text.split(/\s+/)[0].strip

      # Defaults
      @sketchid = 'sketch'  # ID Name for sketch canvas.
      @width    = '640'     # Width for sketch
      @height   = '480'     # Height for sketch

      # Parse Options
      if text =~ /--sketchid=(\S+)/i
        @sketchid = text.match(/--sketchid=(\S+)/i)[1]
      end
      if text =~ /--width=(\S+)/i
        @width = text.match(/--width=(\S+)/i)[1]
      end
      if text =~ /--height=(\S+)/i
        @height = text.match(/--height=(\S+)/i)[1]
      end
    end

    def render(context)
      # Get the full path to the dir
      # Include a filter for Processing Sketches
      srcname = File.basename(@path)
      # Start building tag output
      source  = "<script type=\"text/javascript\">\n"
      source += "function getProcessingSketchID () { return '#{@sketchid}'; }</script>"
      source += "<figure>\n"
      source += "<canvas id=\"#{@sketchid}\" data-processing-sources=\"#{@path}\" width=\"#{@width}\" height=\"#{@height}\">\n"
      source += "<p>Your browser does not support the canvas tag.</p>\n</canvas>\n"
      source += "<figcaption>View source code: <a href=\"#{@path}\">#{srcname}</a></figcaption></figure>\n"
      source
    end
  end
end

Liquid::Template.register_tag('processing_sketch', Jekyll::PSketch)
