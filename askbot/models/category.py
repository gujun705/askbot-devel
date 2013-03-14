'''
Created on Mar 11, 2013

@author: Mingze
'''

from django.db import models
from askbot.models.base import BaseQuerySetManager


class Category(models.Model):

    name = models.CharField(max_length=255, unique=True)

    class Meta:
        app_label = 'askbot'
        db_table = u'category'

    def __unicode__(self):
        return self.name
    
class CategoryManager(BaseQuerySetManager):
    """
    for :class:``~askbot.models.Category`` objects
    """

    def create(self, name = None, **kwargs):
        """Creates a new category"""


        kwargs['name'] = name


        return super(CategoryManager, self).create(**kwargs)

