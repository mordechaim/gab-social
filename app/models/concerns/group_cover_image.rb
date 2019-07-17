# frozen_string_literal: true

module GroupCoverImage
  extend ActiveSupport::Concern
  
  LIMIT            = 4.megabytes
  IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].freeze

  class_methods do
    def cover_image_styles(file)
      styles = { original: { geometry: '1200x475#', file_geometry_parser: FastGeometryParser } }
      styles[:static] = { geometry: '1200x475#', format: 'png', convert_options: '-coalesce', file_geometry_parser: FastGeometryParser } if file.content_type == 'image/gif'
      styles
    end

    private :cover_image_styles
  end

  included do
    has_attached_file :cover_image, styles: ->(f) { cover_image_styles(f) }, convert_options: { all: '-strip' }, processors: [:lazy_thumbnail]
    validates_attachment_content_type :cover_image, content_type: IMAGE_MIME_TYPES
    validates_attachment_size :cover_image, less_than: LIMIT
    remotable_attachment :cover_image, LIMIT
  end

  def cover_image_original_url
    cover_image.url(:original)
  end

  def cover_image_static_url
    cover_image_content_type == 'image/gif' ? cover_image.url(:static) : cover_image_original_url
  end
end
