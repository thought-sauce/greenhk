class RecycleBin
  include Mongoid::Document
  include Locatable

  cache

  field :add, :type => String
  field :add_eng, :type => String

  attr_accessible :add, :add_eng

  validates_format_of :add_eng, :with => /[A-Za-z0-9,\-\(\)\.\s]*/

  referenced_in :subdistrict
end
