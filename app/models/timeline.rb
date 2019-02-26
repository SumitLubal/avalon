# frozen_string_literal: true

# Copyright 2011-2018, The Trustees of Indiana University and Northwestern
#   University.  Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed
#   under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
#   CONDITIONS OF ANY KIND, either express or implied. See the License for the
#   specific language governing permissions and limitations under the License.
# ---  END LICENSE_HEADER BLOCK  ---

class Timeline < ActiveRecord::Base
  belongs_to :user
  scope :by_user, ->(user) { where(user_id: user.id) }
  scope :title_like, ->(title_filter) { where("title LIKE ?", "%#{title_filter}%") }
  scope :with_tag, ->(tag_filter) { where("tags LIKE ?", "%\n- #{tag_filter}\n%") }

  validates :user, presence: true
  validates :title, presence: true
  validates :description, length: { maximum: 255 }
  validates :visibility, presence: true
  validates :visibility, inclusion: { in: proc { [PUBLIC, PRIVATE, PRIVATE_WITH_TOKEN] } }

  delegate :url_helpers, to: 'Rails.application.routes'

  after_initialize :default_values
  before_save :generate_access_token, if: proc { |p| p.visibility == Timeline::PRIVATE_WITH_TOKEN && access_token.blank? }

  serialize :tags

  # visibility
  PUBLIC = 'public'
  PRIVATE = 'private'
  PRIVATE_WITH_TOKEN = 'private-with-token'

  # Default values to be applied after initialization
  def default_values
    self.visibility ||= Timeline::PRIVATE
    self.tags ||= []
  end

  def generate_access_token
    # TODO: Use ActiveRecord's secure_token when we move to Rails 5
    self.access_token = loop do
      random_token = SecureRandom.urlsafe_base64(nil, false)
      break random_token unless self.class.exists?(access_token: random_token)
    end
  end

  def valid_token?(token)
    access_token == token && visibility == Timeline::PRIVATE_WITH_TOKEN
  end
end