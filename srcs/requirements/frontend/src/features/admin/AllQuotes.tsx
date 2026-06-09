import { useState } from 'react';
import { TextArea, Btn, Input, List, Text } from "@/components";
import { editQuote } from '@/api/quote.api';
import type { Quote } from '@/types/api';

interface AllQuotesProps {
  quotes: Quote[];
  loading: boolean;
  onQuotesUpdated: () => void;
  onError: (error: string) => void;
}

export function AllQuotes({ quotes, loading, onQuotesUpdated, onError }: AllQuotesProps) {
  const [editing, setEditing] = useState<{ id: number; text: string; type: string } | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  const handleToggleActive = async (quoteId: number, isActive: boolean) => {
    try {
      setProcessing(quoteId);
      await editQuote(quoteId, { active: !isActive });
      onQuotesUpdated();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update quote');
    } finally {
      setProcessing(null);
    }
  };

  const handleEditSave = async (quoteId: number) => {
    if (!editing || !editing.text.trim()) {
      onError('Quote text is required');
      return;
    }

    try {
      setProcessing(quoteId);
      await editQuote(quoteId, { text: editing.text, type: editing.type || null });
      setEditing(null);
      onQuotesUpdated();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update quote');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Text>Loading quotes...</Text>;
  }

  if (quotes.length === 0) {
    return <Text>No quotes found.</Text>;
  }

  return (
    <List
      items={quotes}
      renderItem={(quote) => (
        <div className={`space-y-3 ${!quote.active ? 'opacity-50' : ''}`}>
          <div className="flex justify-between items-center gap-2">
            <div>
              {quote.type && <Text variant="dim" size="xs">{quote.type}</Text>}
            </div>
            <Text variant="dim" size="xs">{quote.creator?.username || 'Seed'}</Text>
          </div>

          {editing?.id === quote.id ? (
            <div className="space-y-3">
              <TextArea
                label="Quote"
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                rows={3}
              />
              <Input
                label="Type"
                value={editing.type}
                onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                placeholder="Type (optional)"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Text>{quote.text}</Text>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {editing?.id === quote.id ? (
              <>
                <Btn variant="primary" size="sm" disabled={processing === quote.id} onClick={() => handleEditSave(quote.id)}>
                  {processing === quote.id ? 'Saving...' : 'Save'}
                </Btn>
                <Btn variant="secondary" size="sm" disabled={processing === quote.id} onClick={() => setEditing(null)}>
                  Cancel
                </Btn>
              </>
            ) : (
              <>
                <Btn variant="secondary" size="sm" onClick={() => setEditing({ id: quote.id, text: quote.text, type: quote.type || '' })}>
                  Edit
                </Btn>
                <Btn 
                  variant={quote.active ? "danger" : "secondary"} 
                  size="sm" 
                  disabled={processing === quote.id} 
                  onClick={() => handleToggleActive(quote.id, quote.active)}
                >
                  {processing === quote.id ? (quote.active ? 'Deactivating...' : 'Activating...') : (quote.active ? 'Deactivate' : 'Activate')}
                </Btn>
              </>
            )}
          </div>
        </div>
      )}
      className="mt-6 space-y-4"
    />
  );
}
