'''
Chase want to quick index those presentations in
http://askbot/question/175/presentation-tracking-for-within-team-knowledge-sharing/

Is this a good idea? I don't think so...

04-14-2014, by Jun
'''

import datetime
from django.db import models
from askbot.models.base import BaseQuerySetManager


class Presentation(models.Model):

    subject = models.CharField(max_length=255)
    presenter = models.CharField(max_length=255) # the presenter can be an un-registered user
    team = models.CharField(max_length=255)
    link = models.CharField(max_length=255, unique=True)
    present_at = models.DateTimeField(default=datetime.datetime.now)
    answer = models.ForeignKey('Post', related_name='presentation')
    # FIXME: change answer field to post
#     post = models.ForeignKey('Post', related_name='presentation')
    deleted =  models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    create_at = models.DateTimeField(default=datetime.datetime.now)
    update_at = models.DateTimeField(default=datetime.datetime.now)
    
    time_in_text = models.CharField(max_length=255)

    class Meta:
        app_label = 'askbot'
        db_table = u'presentations'

    def __unicode__(self):
        return self.subject
    
class PresentationManager(BaseQuerySetManager):
    """
    for :class:``~askbot.models.PresentationIndexer`` objects
    """

    def create(self, **kwargs):
        """Creates a new PresentationIndexer"""


        """kwargs['name'] = name"""


        return super(PresentationManager, self).create(**kwargs)

