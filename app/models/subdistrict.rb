class Subdistrict
  include Mongoid::Document
  include Locatable
  
  cache
  
  field :name, :type => String
  field :name_eng, :type => String
  
  attr_accessible :name, :name_eng
  
  validates_format_of :name_eng, :with => /[A-Za-z0-9,\-\(\)\.\s]*/
  
  referenced_in :district
  references_many :recycle_bins
end
